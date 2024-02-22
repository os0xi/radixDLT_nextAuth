'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Props = {}

function page() {
  const session = useSession()
  const router = useRouter()
  if (!session.data?.user) router.push('/')
  return <div>{session.data?.user?.id}</div>
}

export default page
