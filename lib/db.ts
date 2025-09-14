import { createClient } from '@supabase/supabase-js'

// --- Supabase Client for Client-Side (Browser) ---
// This client is safe to use in the browser. It does not contain privileged keys.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- Supabase Client for Server-Side (API Routes, Server Components) ---
// For server-side operations where you need higher privileges or to bypass RLS,
// you would typically use a service role key.
// However, for Next.js API routes and Server Components interacting with RLS-enabled tables,
// it's often better to create a client that can set the user's session from cookies
// to ensure RLS policies are applied correctly.
// For now, we'll provide a basic server client setup.
// For advanced Next.js server-side patterns, consider using Supabase's provided helpers:
// https://supabase.com/docs/guides/auth/server-side/nextjs

// Example for server-side use in API routes (less common for direct client creation, more for auth helpers)
export const createServerSupabaseClient = () => {
  // In a real application, you'd typically pass `headers().get('cookie')` from
  // a Server Component or Route Handler to `createBrowserClient` or `createClientComponentClient`
  // from `@supabase/auth-helpers-nextjs` to get a session-aware client.
  // This is a simplified direct client for demonstration; actual server-side best practices
  // with Next.js App Router might look different depending on specific needs (RLS vs admin access).
  // For RLS, you'd usually retrieve the session from cookies and use it.
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use service key if available, otherwise anon. Be careful with service role key.
    {
      auth: {
        persistSession: false, // Sessions are usually managed by the environment/helpers server-side
      }
    }
  );
};