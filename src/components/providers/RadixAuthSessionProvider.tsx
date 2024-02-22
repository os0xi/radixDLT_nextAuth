'use client'
import { useAccounts } from '@/hooks/useAccounts'
import { usePersona } from '@/hooks/usePersona'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

type Props = { children: React.ReactNode }

function RadixAuthSessionProvider({ children }: Props) {
  const { data: session } = useSession()
  const {
    state: { accounts, status: accountsStatus },
  } = useAccounts()
  const { persona, hasLoaded: hasLoadedPersona } = usePersona()
  console.log('persona / has loaded', persona, '/', hasLoadedPersona)
  // console.log(accounts[0] + ' ' + accountsStatus)
  const signOutUser = async () => {
    await signOut({ redirect: false })
  }
  const [isSigningOut, setIsSigningOut] = useState(false)

  //for detecting log-out and terminating server session
  useEffect(() => {
    if (session && hasLoadedPersona && !persona && !isSigningOut) {
      setIsSigningOut(true) // Prevent further sign-out attempts
      signOutUser().then(() => {
        setIsSigningOut(false) // Reset the state
      })
    }
  }, [persona])
  return <div>{children}</div>
}

export default RadixAuthSessionProvider
