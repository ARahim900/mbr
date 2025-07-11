# Supabase Authentication Setup Guide

This guide will help you connect your Muscat Bay application to Supabase for persistent user authentication and storage.

## Prerequisites

1. A Supabase account (sign up at https://app.supabase.com)
2. A Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 2: Configure Environment Variables

1. Create a `.env` file in your project root (same level as `package.json`)
2. Add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** Replace the placeholder values with your actual Supabase credentials.

## Step 3: Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire content of `database/supabase_setup.sql`
3. Click **Run** to execute the SQL script

This will create:
- `user_profiles` table to store user information
- Row Level Security (RLS) policies for data protection
- Triggers to automatically create profiles when users sign up
- Indexes for better performance

## Step 4: Update Supabase Client Configuration

The file `services/supabaseClient.ts` should automatically pick up your environment variables. If you need to hardcode the values temporarily for testing, update:

```typescript
const supabaseUrl = 'https://your-project-ref.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'
```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to register a new user:
   - The user will be created in Supabase Auth
   - A profile will be automatically created in the `user_profiles` table
   - The user will be logged in automatically

3. Try logging in with the registered user:
   - The system will authenticate through Supabase
   - User data will be retrieved from your database

## Step 6: Configure Email Settings (Optional)

For production use, you may want to configure email verification:

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your SMTP settings or use Supabase's built-in email service
3. Enable email confirmation if desired

## Features

### What's Working Now

✅ **User Registration**: New users are created in Supabase with profiles  
✅ **User Login**: Authentication through Supabase with username/email  
✅ **Session Management**: Automatic session handling and persistence  
✅ **Fallback Authentication**: Demo users still work if Supabase is not configured  
✅ **Data Security**: Row Level Security ensures users can only access their own data  

### User Roles & Permissions

- **Operator** (default): Read and write access to basic features
- **Manager**: Additional reporting and approval permissions
- **Admin**: Full system access including settings and user management

### Automatic Fallback

If Supabase is not configured or fails to connect, the application will automatically fall back to:
- Demo users (admin/admin123, manager/manager123, operator/operator123)
- Local storage for custom registrations

## Troubleshooting

### Common Issues

1. **Environment variables not loading**:
   - Make sure `.env` file is in the project root
   - Restart your development server after adding environment variables
   - Check that variable names start with `REACT_APP_`

2. **Database connection errors**:
   - Verify your Project URL and API key are correct
   - Check that your Supabase project is not paused
   - Ensure the SQL setup script ran without errors

3. **User registration fails**:
   - Check the browser console for error messages
   - Verify the `user_profiles` table exists in Supabase
   - Ensure RLS policies are properly set up

4. **Login not working**:
   - Make sure the user exists in both Supabase Auth and the `user_profiles` table
   - Check that the username and email match between tables

### Checking Your Setup

1. **Verify Database Tables**:
   - Go to Supabase dashboard → **Table Editor**
   - You should see a `user_profiles` table

2. **Check User Creation**:
   - After registering, go to **Authentication** → **Users** in Supabase
   - You should see the new user listed

3. **Verify Profile Data**:
   - Go to **Table Editor** → **user_profiles**
   - You should see profile data for registered users

## Security Notes

- Never commit your `.env` file to version control
- Use different Supabase projects for development and production
- The anon key is safe to use in frontend applications
- Row Level Security ensures data protection at the database level

## Next Steps

Once Supabase is working, you can:
- Set up email verification for new users
- Add password reset functionality
- Implement user role management
- Add user profile editing features
- Set up database backups and monitoring

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Supabase project settings
3. Review the SQL setup script for any errors
4. Check Supabase logs in the dashboard under **Logs** 