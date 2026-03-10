import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '../../lib/supabaseClient'

type AuthContextValue = {
  user: {
    id: string
    email: string | null
    role: 'author' | 'reader'
  } | null
  loading: boolean
  registerEmail: (email: string, password: string) => Promise<void>
  loginEmail: (email: string, password: string) => Promise<void>
  loginGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null)
  const [loading, setLoading] = useState(true)
  const authorEmail = import.meta.env.VITE_AUTHOR_EMAIL ?? null

  const resolveRole = (email: string | null): 'author' | 'reader' => {
    if (!email) return 'reader'
    if (authorEmail && email.toLowerCase() === authorEmail.toLowerCase()) {
      return 'author'
    }
    return 'reader'
  }

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const email = user.email ?? null
        setUser({ id: user.id, email, role: resolveRole(email) })
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email ?? null
        setUser({ id: session.user.id, email, role: resolveRole(email) })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const registerEmailWrapper = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const loginEmailWrapper = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const loginGoogleWrapper = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const signOutWrapper = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerEmail: registerEmailWrapper,
        loginEmail: loginEmailWrapper,
        loginGoogle: loginGoogleWrapper,
        signOut: signOutWrapper,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

