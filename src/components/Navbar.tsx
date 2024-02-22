'use client'
import Image from 'next/image'
import '@radixdlt/dapps-dropdown'

import { useRef } from 'react'

import Logo from '../../public/assets/logo.svg'

import { Button } from './ui/button'
import Link from 'next/link'
import { useDappToolkit } from '@/hooks/useDappToolkit'
import { useSession } from 'next-auth/react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'radix-connect-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
      'radix-dapps-dropdown': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

export const Header = ({ className = '' }: { className?: string }) => {
  const dappToolkit = useDappToolkit()
  const { data } = useSession()
  const user = data?.user
  const ref = useRef<any>(null)
  return (
    <header className="flex py-2 px-8 w-full justify-between items-center">
      <Image src={Logo} height={42} width={64} alt="logo" />
      <div className="flex gap-2">
        <Link href="/">Home</Link>
        <Link href="/account">Account</Link>
      </div>
      <div className="">
        <div className="">
          {user ? (
            <Button onClick={() => dappToolkit.disconnect()}>Log Out</Button>
          ) : (
            <radix-connect-button ref={ref} />
          )}
        </div>
      </div>
    </header>
  )
}
