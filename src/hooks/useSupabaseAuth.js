/**
 * useSupabaseAuth.js — SolarAxis Monitor: Auth State Hook
 * 
 * Wraps Supabase auth into a clean React hook.
 * Use this in App.jsx to replace the current mock login.
 */
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getUserProfile } from '../lib/supabaseService'

export function useSupabaseAuth() {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user + profile on mount / session restore
  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return

      if (session?.user) {
        setUser(session.user)
        try {
          const prof = await getUserProfile(session.user.id)
          if (mounted) setProfile(prof)
        } catch {
          // Profile may not exist yet — ignore
        }
      }
      setLoading(false)
    }

    init()

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          try {
            const prof = await getUserProfile(session.user.id)
            if (mounted) setProfile(prof)
          } catch {
            setProfile(null)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  /** Sign in — returns the user role for routing */
  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const prof = await getUserProfile(data.user.id)
    return prof?.role || 'customer'
  }, [])

  /** Sign out */
  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  /** Sign up — creates auth user + profile */
  const register = useCallback(async ({ email, password, fullName, phone, role, vendorId }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone, role } },
    })
    if (error) throw error

    // Profile is auto-created by the DB trigger (handle_new_user)
    return data
  }, [])

  /** Send password reset email */
  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }, [])

  return {
    user,
    profile,
    role: profile?.role || null,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    resetPassword,
  }
}
