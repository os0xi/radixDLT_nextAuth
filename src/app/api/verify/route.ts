// Assuming Rola and SignedChallenge are imported correctly
import { Rola, SignedChallenge } from '@radixdlt/rola' // Adjust based on actual import

const { verifySignedChallenge } = Rola({
  applicationName: 'Rola Full Stack Typescript Example',
  dAppDefinitionAddress:
    'account_rdx12xuhw6v30chdkhcu7qznz9vu926vxefr4h4tdvc0mdckg9rq4afx9t', // address of the dApp definition
  networkId: 1, // network id of the Radix network
  expectedOrigin: 'http://localhost:3000', // origin of the client making the wallet request
})

export async function POST(req: Request, _: Response) {
  const input = await req.json()
  console.log(input)
  const challenges = input.proofs.map((challenge: any) => challenge)
  // Deduplicate challenges
  const uniqueChallenges = [...new Set<SignedChallenge>(challenges)]

  // Verify each challenge
  const isChallengeValid = uniqueChallenges.every(
    (challenge: SignedChallenge) => {
      console.log(challenge)
      return verifySignedChallenge(challenge)
    }
  )
  if (!isChallengeValid) {
    return new Response(JSON.stringify({ valid: false }), { status: 400 })
  }
  console.log('verification request for input: ', input)
  const headers = {
    'Content-Type': 'application/json',
  }
  const responseBody = JSON.stringify({ valid: true })

  return new Response(responseBody, { status: 200 })
}
