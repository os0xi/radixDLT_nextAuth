'use client'

import { useSession } from 'next-auth/react'

export default function Page() {
  const { data } = useSession()
  const user = data?.user
  return (
    <main className="container">
      {user?.id}
      {!user && <p>Sign in using Radix Connect</p>}
    </main>
  )
}
