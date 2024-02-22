// utils/challengeStore.ts
import crypto from 'node:crypto'

export const secureRandom = (byteCount: number): string =>
  crypto.randomBytes(byteCount).toString('hex')
interface ChallengeEntry {
  expires: number
}

const challenges = new Map<string, ChallengeEntry>()

export const createChallenge = (): string => {
  const challenge = secureRandom(32) // 32 random bytes as hex string
  const expires = Date.now() + 1000 * 60 * 5 // expires in 5 minutes
  challenges.set(challenge, { expires }) // store challenge with expiration
  return challenge
}

export const verifyChallenge = (challenge: string): boolean => {
  const entry = challenges.get(challenge)
  if (!entry) return false

  const isExpired = Date.now() > entry.expires
  if (isExpired) {
    challenges.delete(challenge) // Clean up expired challenge
    return false
  }
  return true
}
