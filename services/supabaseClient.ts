import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project details
// You can find these in your Supabase dashboard under Settings > API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

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