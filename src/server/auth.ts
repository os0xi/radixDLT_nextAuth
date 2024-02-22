import { getServerSession, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'
import { verifyProofs } from '@/lib/utils'

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
        console.log('proofs ', credentials?.proofs)
        if (!credentials) return null

        const proofs = JSON.parse(credentials.proofs) ?? []
        const accounts = JSON.parse(credentials.accounts) ?? []
        const isValid = await verifyProofs(proofs)
        if (isValid) {
          // If valid, return a user object or true
          // Adjust according to your application's needs
          const dbUser = await db.user.findUnique({
            where: { id: accounts[0].address },
          })
          if (!dbUser) {
            await db.user.create({
              data: {
                id: accounts[0].address,
                account_label: accounts[0].label,
                persona: proofs[0].address,
              },
            })
          }
          return {
            id: accounts[0].address,
            account_label: accounts[0].label,
            persona: proofs[0].address,
          } // Example user object
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
        token.account_label = user.account_label // Pass the user's account label to the token
        token.persona = user.persona // Pass the user's persona to the token
        // You can add more details to the token here, which can then be used in the session callback
        // token.walletAddress = user.walletAddress;
      }
      return token
    },
    async session({ session, token }) {
      // Attach the user details to the session object
      session.user.id = token.id
      session.user.account_label = token.account_label
      session.user.persona = token.persona
      session.user.account_label = token.account_label
      return session
    },
  },
}

export const getServerAuthSession = () => getServerSession(authOptions)
