import crypto from 'node:crypto'

const secureRandom = (byteCount: number): string =>
  crypto.randomBytes(byteCount).toString('hex')

const challenges = new Map<string, { expires: number }>()

const create = () => {
  const challenge = secureRandom(32) // 32 random bytes as hex string
  const expires = Date.now() + 1000 * 60 * 5 // expires in 5 minutes
  challenges.set(challenge, { expires }) // store challenge with expiration

  return challenge
}
export async function GET() {
  const challenge = create()
  console.log(challenge)
  return new Response(challenge, { status: 200 })
}
