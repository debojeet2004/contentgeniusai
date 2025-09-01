import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
      const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }
  // console.log("Session :", session)
  return (
    <div>
      {children}
    </div>
  )
}
