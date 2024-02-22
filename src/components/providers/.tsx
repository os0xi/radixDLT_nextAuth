'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const queryClient = new QueryClient()
export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClientStore] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60000,
          },
        },
      })
  )
  return (
    <QueryClientProvider client={queryClientStore}>
      {children}
    </QueryClientProvider>
  )
}
