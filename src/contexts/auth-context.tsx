'use client'

// Deprecated: demo auth is being replaced by NextAuth. This file remains to avoid broken imports during migration.
import React from 'react'

type PlaceholderAuth = {
  user: null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const placeholder: PlaceholderAuth = {
  user: null,
  login: async () => ({ success: false, error: 'NextAuth in progress' }),
  logout: () => {},
  isLoading: false,
}

const AuthContext = React.createContext<PlaceholderAuth>(placeholder)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={placeholder}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return React.useContext(AuthContext)
}