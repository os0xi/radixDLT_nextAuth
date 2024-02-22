import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function verifyProofs(proofs: any) {
  try {
    // Assuming your verification endpoint expects a JSON payload with the proofs
    const response = await fetch('/api/verify', {
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
