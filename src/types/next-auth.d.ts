// next-auth.d.ts
import 'next-auth'
import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id?: string
    account_label?: string
    persona?: string
  }

  interface Session {
    user: User & {
      id?: string
      account_label?: string
      persona?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    account_label?: string
    persona?: string
  }
}
