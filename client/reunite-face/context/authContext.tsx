'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type User = { account_id: string;name: string; email: string; role: string; phone: string }
type AuthContextType = {
  user: User | null
  setUser: (u: User | null) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' })
        const data = await res.json()
        if (data.loggedIn) setUser(data.user)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)