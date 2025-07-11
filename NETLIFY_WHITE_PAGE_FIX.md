# Fix White Page Issue on Netlify

## Problem
Your app shows a white page because the Clerk authentication key is missing in Netlify's environment variables.

## Quick Fix (2 minutes)

### 1. Add Environment Variable to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click on your site **muscatbay.live**
3. Go to **Site configuration** → **Environment variables**
4. Click **Add a variable**
5. Add this variable:
   - **Key**: `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value**: `pk_test_YWNjZXB0ZWQtYW50LTk3LmNsZXJrLmFjY291bnRzLmRldiQ`
6. Click **Save**

### 2. Trigger a New Deployment

After adding the environment variable:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait 1-2 minutes for deployment to complete

### 3. Verify It's Working

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Visit https://muscatbay.live
4. Check for any error messages

## Why This Happens

When your app starts, it looks for the Clerk key:
```javascript
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
```

Without this key, the app throws an error and shows a white page.

## Alternative: Check Build Logs

If still not working after adding the variable:

1. In Netlify, go to **Deploys**
2. Click on the latest deploy
3. Check the deploy log for errors
4. Look specifically for "Missing Clerk Publishable Key" error

## Debugging Steps

If you still see a white page:

1. **Clear Browser Cache**
   - Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   
2. **Check Console Errors**
   - F12 → Console tab
   - Look for red error messages
   
3. **Try Incognito Mode**
   - This bypasses all cache issues

## Success Indicators

When it's working, you'll see:
- The Clerk login page with Google sign-in
- No errors in the browser console
- The page loads without being blank

## Need More Help?

Check the browser console (F12) and share any error messages you see. 