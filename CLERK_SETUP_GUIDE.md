# Clerk Authentication Setup Guide

This guide will help you integrate Clerk authentication into your Muscat Bay application.

## Prerequisites

- Node.js and npm installed
- A Clerk account (sign up at https://clerk.com)

## Step 1: Install Clerk

The Clerk React SDK has already been installed in your project:

```bash
npm install @clerk/clerk-react
```

## Step 2: Create a Clerk Application

1. Go to https://clerk.com/dashboard
2. Click "Create Application"
3. Choose a name for your application (e.g., "Muscat Bay MBR")
4. Select your preferred authentication methods:
   - Email/Password
   - Social logins (Google, GitHub, etc.) - optional
5. Click "Create Application"

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root and add your Clerk keys:

```env
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Existing environment variables
GEMINI_API_KEY=your_gemini_api_key_here
```

**Where to find your Clerk keys:**
1. In your Clerk Dashboard, go to "API Keys"
2. Copy the "Publishable Key" to `VITE_CLERK_PUBLISHABLE_KEY`
3. Copy the "Secret Key" to `CLERK_SECRET_KEY`

## Step 4: Configure Clerk Settings

In your Clerk Dashboard:

### Authentication Settings
1. Go to "User & Authentication" → "Email, Phone, Username"
2. Configure your preferred sign-in methods
3. Enable/disable username requirements as needed

### Appearance Customization
1. Go to "Customization" → "Appearance"
2. Customize colors and branding to match your Muscat Bay theme
3. Upload your logo if desired

### Domain Configuration
1. Go to "Domains"
2. Add your development domain (e.g., `localhost:5173`)
3. Add your production domain when ready to deploy

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your application
3. You should see the Clerk authentication forms
4. Try signing up with a new account
5. Test signing in and out

## Features Implemented

### Authentication Components
- **Sign In**: Custom-styled Clerk SignIn component
- **Sign Up**: Custom-styled Clerk SignUp component
- **User Button**: Clerk UserButton in the sidebar for user management

### User Management
- User profile information display
- Logout functionality
- Protected routes (authenticated users only)

### Styling
- Custom appearance configuration matching your Muscat Bay theme
- Responsive design for mobile and desktop
- Dark mode support

## Customization Options

### Appearance Customization
The Clerk components are styled to match your existing design system:
- Custom colors matching your accent colors
- Consistent button styles
- Proper dark mode support

### Additional Features
You can enable additional Clerk features:
- Multi-factor authentication
- Social login providers
- User profile management
- Organization support

## Troubleshooting

### Common Issues

1. **"Missing Clerk Publishable Key" Error**
   - Ensure `VITE_CLERK_PUBLISHABLE_KEY` is set in your `.env.local`
   - Restart your development server after adding environment variables

2. **Authentication Not Working**
   - Check that your domain is added to Clerk's allowed domains
   - Verify your API keys are correct and not expired

3. **Styling Issues**
   - The appearance configuration is customized for your theme
   - You can modify the `appearance` prop in the components for further customization

### Development vs Production

- For development: Use test keys (`pk_test_*` and `sk_test_*`)
- For production: Use live keys (`pk_live_*` and `sk_live_*`)
- Always use environment variables, never hardcode keys

## Migration from Custom Auth

Your previous custom authentication system has been replaced with Clerk:

### What Changed
- `AuthContext` is no longer used
- `LoginPage` and `SignUpPage` now use Clerk components
- User data comes from Clerk's user object
- Logout is handled by Clerk's UserButton

### Data Migration
If you had existing users in your custom system:
1. Export user data from your previous system
2. Use Clerk's User Management API to import users
3. Or allow users to re-register with Clerk

## Security Benefits

Clerk provides enterprise-grade security:
- Encrypted user data
- Secure session management
- Built-in protection against common attacks
- Compliance with data protection regulations
- Regular security updates

## Next Steps

1. Set up your environment variables
2. Configure your Clerk application settings
3. Test the authentication flow
4. Customize the appearance further if needed
5. Deploy to production with live Clerk keys

For more advanced features and customization options, refer to the [Clerk Documentation](https://clerk.com/docs). 