import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string
      email?: string
      image?: string
    }
  }
}
async function verifyProofs(proofs: any) {
  try {
    // Assuming your verification endpoint expects a JSON payload with the proofs
    const response = await fetch('http://localhost:3000/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any additional headers your endpoint requires
      },
      body: JSON.stringify({ proofs }),
    })

    if (!response.ok) {
      // Handle HTTP error responses
      console.error(
        'Verification endpoint responded with non-OK status:',
        response.status
      )
      return false
    }

    const data = await response.json()

    // Assuming the endpoint returns an object with a boolean `valid` property
    return data.valid
  } catch (error) {
    // Handle network errors or other unexpected errors
    console.error('Failed to verify proofs:', error)
    return false
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
  }
}
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Radix',
      credentials: {
        proofs: { label: 'Proofs', type: 'text' },
        accounts: { label: 'Accounts', type: 'text' },
      },
      authorize: async (credentials) => {
        console.log('in nextauth authorize')
        console.log('acccounts ', credentials?.accounts)
        if (!credentials) return null

        const proofs = JSON.parse(credentials.proofs) ?? []
        const accounts = JSON.parse(credentials.accounts) ?? []
        const isValid = await verifyProofs(proofs)
        if (isValid) {
          // If valid, return a user object or true
          // Adjust according to your application's needs
          return { id: accounts[0].address, name: 'Radix User' } // Example user object
        } else {
          // If the verification fails, return null to indicate an authentication failure
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      // If the user object exists, it means this is the first time the JWT callback is being run, immediately after successful authorization
      if (user) {
        token.id = user.id // Pass the user's ID (or walletAddress) to the token
        // You can add more details to the token here, which can then be used in the session callback
        // token.walletAddress = user.walletAddress;
      }
      return token
    },
    async session({ session, token }) {
      // Attach the user details to the session object
      if (session && session.user) {
        session.user.id = token.id
      } else {
        // Handle the case where session or session.user is undefined
        // For example, initializing session.user if it doesn't exist
        session.user = { id: token.id }
      } // Assuming token.id contains the walletAddress or a relevant user identifier
      // You can add more user details to the session here, e.g.:
      // session.user.walletAddress = token.walletAddress;
      return session
    },
  },
}
