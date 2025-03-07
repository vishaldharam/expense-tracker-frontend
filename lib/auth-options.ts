import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

// Mock user database - in a real app, this would be your database

// This would be your actual authentication logic
async function authenticate(email: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await response.json();

    if (!response?.ok || result?.message == "Invalid credentials") {
      throw new Error(result?.error?.message || "Invalid credentials");
    }

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  } catch (error: any) {
    console.error("Authentication failed:", error.message);
    return null;
  }
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to refresh token");
    }

    return {
      ...token,
      accessToken: result.data.accessToken,
      accessTokenExpires: Date.now() + 10 * 60 * 60 * 1000, // 10 hours
      refreshToken: result.data.refreshToken ?? token.refreshToken, // Keep the same refreshToken if not updated
    };
  } catch (error) {
    console.error("Refresh Token Error:", error);

    return {
      ...token,
      error: "RefreshTokenError", // This helps to handle forced logout if refresh fails
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing email or password");
            return null;
          }

          const user = await authenticate(
            credentials.email,
            credentials.password
          );

          if (!user) {
            console.error("User not found or invalid credentials");
            return null;
          }

          return user; // ✅ Ensure this returns the full user object
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user && token) {
        return {
          ...token,
          userId: user.id,
          accessToken: user.accessToken,
          accessTokenExpires: Date.now() + 10 * 60 * 60 * 1000, // 10 hours
          refreshToken: user.refreshToken,
        };
      }

      // If token is still valid, return it
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token expired, refresh it
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.error === "RefreshTokenError") {
        session.error = "Session expired. Please log in again.";
      }

      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
