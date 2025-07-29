import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL environment variable is required. Please add it to your .env.local file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY environment variable is required. Please add it to your .env.local file.'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error(
    'VITE_SUPABASE_URL must be a valid URL. Please check your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database type definitions for user profiles
export interface UserProfile {
  id: string
  username: string
  full_name: string
  email: string
  department: string
  role: 'admin' | 'manager' | 'operator'
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
} 