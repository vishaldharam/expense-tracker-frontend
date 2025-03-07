"use client"

import { useSession } from "next-auth/react"

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div>Not signed in</div>
  }

  return (
    <div>
      <p>Signed in as {session?.user?.email}</p>
      <p>User ID: {session?.user?.id}</p>
      <p>Access Token: {session?.accessToken.substring(0, 10)}...</p>
    </div>
  )
}

