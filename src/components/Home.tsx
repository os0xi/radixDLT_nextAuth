'use client'

import { usePersona } from '@/hooks/usePersona'

export const Home = () => {
  const { persona } = usePersona()

  return (
    <div className="container">
      {persona ? 'welcome dude ' : 'login first dude'}
    </div>
  )
}
