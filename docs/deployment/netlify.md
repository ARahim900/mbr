# Netlify Deployment Guide - Clerk Authentication

## Your Clerk Keys
- **Publishable Key**: `pk_test_YWNjZXB0ZWQtYW50LTk3LmNsZXJrLmFjY291bnRzLmRldiQ`
- **Secret Key**: `sk_test_6hLaSHmPLVZAzPKw6EH94fDPvbGLrUzUp7LVP2G8cI` (not needed for frontend)

## Step-by-Step Deployment Instructions

### 1. Add Environment Variable to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site (muscatbay.live)
3. Navigate to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add the following:
   - **Key**: `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value**: `pk_test_YWNjZXB0ZWQtYW50LTk3LmNsZXJrLmFjY291bnRzLmRldiQ`
   - **Scopes**: Select all deployment contexts (Production, Preview, Branch deploys)
6. Click **Save**

### 2. Clear Cache and Redeploy

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** dropdown
3. Select **Clear cache and deploy site**
4. Wait for deployment to complete (usually 1-2 minutes)

### 3. Configure Clerk Dashboard

While deployment is running, configure your Clerk application:

1. Go to [Clerk Dashboard](https://clerk.com/dashboard)
2. Select your application
3. Go to **Domains** in the left sidebar
4. Add your production domain: `muscatbay.live`
5. Also add: `https://muscatbay.live`
6. If you have a Netlify preview URL, add that too

### 4. Verify Deployment

Once deployment is complete:

1. Visit https://muscatbay.live
2. You should see the new Clerk login page with:
   - Google sign-in button
   - Email/password fields
   - "Welcome Back" heading
   - "Please sign in to your account" subheading

### 5. Test Authentication

1. Try signing in with Google
2. Or create a new account with email/password
3. After successful login, you should see the main application

## Troubleshooting

### Still seeing old login page?
1. **Hard refresh**: Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache**: Settings → Privacy → Clear browsing data
3. **Try incognito mode**: This bypasses all cache
4. **Check deployment logs**: In Netlify, go to Deploys → Click on latest deploy → View logs

### Build errors?
Check if the error mentions:
- Missing Clerk key: Verify environment variable is set correctly
- Module not found: May need to clear cache and redeploy

### Authentication not working?
1. Verify domain is added in Clerk dashboard
2. Check browser console for errors (F12 → Console)
3. Ensure you're using HTTPS (Netlify handles this automatically)

## Next Steps

After successful deployment:
1. Consider upgrading to Clerk production keys when ready
2. Configure additional authentication methods if needed
3. Set up user roles and permissions in Clerk dashboard

## Security Note
- The `.env.local` file is only for local development
- Never commit it to Git (it's already in .gitignore)
- Netlify environment variables are secure and encrypted 