import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
    accessToken: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    accessToken: string
    accessTokenExpires: number
    refreshToken: string
    error?: string
  }
}

