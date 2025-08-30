"use client";

import { createAuthClient } from "better-auth/react"
import { createContext, useContext, ReactNode } from "react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "/api/auth"
})

// Export all the auth functions
export const { signIn, signUp, useSession, signOut } = authClient

// Create a context for the auth client
const AuthContext = createContext(authClient)

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={authClient}>
      {children}
    </AuthContext.Provider>
  )
}

// Export the context for use in other components
export const useAuthClient = () => useContext(AuthContext)