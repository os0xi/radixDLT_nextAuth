'use client'
import { signIn, useSession } from 'next-auth/react'
import { WalletSdk } from '@radixdlt/wallet-sdk'
import { Result } from 'neverthrow'
import { config } from '@/config'
import { RadixProvider } from '@/radix/RadixProvider'
import {
  DataRequestBuilder,
  RadixDappToolkit,
  createLogger,
} from '@radixdlt/radix-dapp-toolkit'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export default function RadixDappToolkitProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = useState<RadixDappToolkit | undefined>()

  // Initialize Radix Dapp Toolkit in the client
  useEffect(() => {
    const radixDappToolkit = RadixDappToolkit({
      networkId: config.network.networkId,
      dAppDefinitionAddress: config.dAppDefinitionAddress,
      logger: createLogger(2),
    })
    radixDappToolkit.walletApi.setRequestData(
      DataRequestBuilder.persona().withProof(),
      DataRequestBuilder.accounts().atLeast(1)
    )
    radixDappToolkit.walletApi.provideChallengeGenerator(() =>
      fetch('/api/create-challenge')
        .then((res) => res.text())
        .then((data) => data)
    )
    radixDappToolkit.walletApi.dataRequestControl(
      async ({ proofs, accounts }) => {
        const credentials = {
          proofs: JSON.stringify(proofs),
          accounts: JSON.stringify(accounts), // pass accounts too so they can be used inside sessions if needed
        }
        console.log('credentials', credentials)
        // Call signIn() with the custom provider and credentials
        const result = await signIn('credentials', {
          redirect: false, // Prevent NextAuth.js from redirecting
          ...credentials, // Pass the proofs as credentials
        })
        // Check the result of the signIn attempt
        if (!result?.ok) {
          throw new Error('Invalid proof')
        } else {
          // Optional: Handle successful sign-in, such as redirecting the user
        }
      }
    )

    setState(radixDappToolkit)

    return () => {
      radixDappToolkit.destroy()
    }
  }, [])
  if (!state)
    return (
      <div className="w-screen min-h-screen h-full bg-background flex flex-col gap-4 justify-center items-center text-muted-foreground">
        Loading Radix provider...
        <Loader className="w-12 h-12 animate-spin text-blue-600 duration-1000" />
      </div>
    )

  return <RadixProvider value={state}>{children}</RadixProvider>
}
