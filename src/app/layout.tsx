import RadixDappProvider from '@/components/providers/RadixDappToolkitProvider'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { Header } from '@/components/Navbar'
import { ThemeProvider } from '@/components/providers/NextTheme'
import AuthSessionProvider from '@/components/providers/SessionProvider'
import RadixAuthSessionProvider from '@/components/providers/RadixAuthSessionProvider'
import ReactQueryProvider from '@/components/providers/ReactQueryProvider'

const font = Inter({
  weight: ['400', '600'],
  style: ['normal'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NextAuth Radix Connect Rola Example',
  description: 'ROLA Example for NextAuth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <meta
          property="og:title"
          content="NextAuth Radix Connect Rola Example"
        />
        <meta property="og:description" content="ROLA Example for NextAuth" />
      </Head>

      <body className={font.className}>
        <RadixDappProvider>
          <AuthSessionProvider>
            <RadixAuthSessionProvider>
              <ReactQueryProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Header />
                  {children}
                </ThemeProvider>
              </ReactQueryProvider>
            </RadixAuthSessionProvider>
          </AuthSessionProvider>
        </RadixDappProvider>
      </body>
    </html>
  )
}
