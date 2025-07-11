import { supabase, UserProfile } from './supabaseClient'
import { User } from '../contexts/AuthContext'

export interface SignUpData {
  username: string
  email: string
  password: string
  fullName: string
  department: string
}

export interface LoginData {
  username: string
  password: string
}

class AuthService {
  // Sign up a new user
  async signUp(userData: SignUpData): Promise<User> {
    const { username, email, password, fullName, department } = userData

    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (existingUser) {
        throw new Error('Username already exists. Please choose a different username.')
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
            full_name: fullName,
            department,
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('Email address already registered. Please use a different email.')
        }
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create user profile in our custom table
      const userProfile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'> = {
        username: username.toLowerCase(),
        full_name: fullName,
        email: email.toLowerCase(),
        department,
        role: 'operator', // Default role
        permissions: ['read', 'write'] // Default permissions
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([userProfile])
        .select()
        .single()

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Failed to create user profile: ' + profileError.message)
      }

      // Convert to our User interface
      const user: User = {
        id: authData.user.id,
        username: profileData.username,
        role: profileData.role,
        fullName: profileData.full_name,
        department: profileData.department,
        permissions: profileData.permissions,
        email: profileData.email
      }

      return user
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred during sign up')
    }
  }

  // Log in an existing user
  async login(credentials: LoginData): Promise<User> {
    const { username, password } = credentials

    try {
      // First, get the user's email from their username
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .single()

      if (profileError || !profileData) {
        throw new Error('Invalid username or password')
      }

      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password
      })

      if (authError) {
        throw new Error('Invalid username or password')
      }

      if (!authData.user) {
        throw new Error('Login failed')
      }

      // Convert to our User interface
      const user: User = {
        id: authData.user.id,
        username: profileData.username,
        role: profileData.role,
        fullName: profileData.full_name,
        department: profileData.department,
        permissions: profileData.permissions,
        email: profileData.email
      }

      return user
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred during login')
    }
  }

  // Log out the current user
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error('Failed to log out: ' + error.message)
    }
  }

  // Get current session
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      throw new Error('Failed to get session: ' + error.message)
    }
    return session
  }

  // Get current user profile
  async getCurrentUserProfile(): Promise<User | null> {
    const session = await this.getCurrentSession()
    if (!session?.user) {
      return null
    }

    const { data: profileData, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error || !profileData) {
      return null
    }

    return {
      id: session.user.id,
      username: profileData.username,
      role: profileData.role,
      fullName: profileData.full_name,
      department: profileData.department,
      permissions: profileData.permissions,
      email: profileData.email
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userProfile = await this.getCurrentUserProfile()
        callback(userProfile)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()
export default authService 