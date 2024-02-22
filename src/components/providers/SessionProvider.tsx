'use client'
import { usePersona } from '@/hooks/usePersona'
import { SessionProvider, signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

type Props = { children: React.ReactNode }

function AuthSessionProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthSessionProvider
