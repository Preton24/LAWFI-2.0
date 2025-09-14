import { supabase } from './db' // Import the Supabase client
import type { Session, User } from '@supabase/supabase-js'

/**
 * Signs up a new user with email and password.
 * @param email User's email.
 * @param password User's password.
 * @returns A promise resolving to user data or null if an error occurs.
 */
export async function signUp(email: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // You can also add options like `redirectTo` for email confirmation flow
    })

    if (error) {
      throw error
    }

    return data.user
  } catch (error: any) {
    console.error('Error signing up:', error.message)
    return null
  }
}

/**
 * Signs in an existing user with email and password.
 * @param email User's email.
 * @param password User's password.
 * @returns A promise resolving to user data or null if an error occurs.
 */
export async function signIn(email: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data.user
  } catch (error: any) {
    console.error('Error signing in:', error.message)
    return null
  }
}

/**
 * Signs out the current user.
 * @returns A promise indicating success or failure.
 */
export async function signOut(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    return true
  } catch (error: any) {
    console.error('Error signing out:', error.message)
    return false
  }
}

/**
 * Gets the current user session.
 * @returns A promise resolving to the user session or null if no session.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return session
  } catch (error: any) {
    console.error('Error getting session:', error.message)
    return null
  }
}

/**
 * Gets the current authenticated user.
 * @returns A promise resolving to the user object or null if no user is logged in.
 */
export async function getUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      throw error
    }

    return user
  } catch (error: any) {
    console.error('Error getting user:', error.message)
    return null
  }
}

// --- OAuth / Social Logins ---
export async function signInWithOAuth(provider: 'google' | 'github' | 'discord') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Configure this callback in Supabase dashboard
      },
    });

    if (error) {
      throw error;
    }
    // data.url will contain the URL to redirect the user to for OAuth flow
    return data.url;
  } catch (error: any) {
    console.error(`Error signing in with ${provider}:`, error.message);
    return null;
  }
}

// Note: For Next.js App Router, it's often recommended to use
// `@supabase/auth-helpers-nextjs` for server-side cookie management and
// creating session-aware Supabase clients in server components/API routes.
// This `auth.ts` focuses on direct Supabase client calls.