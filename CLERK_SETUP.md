# Clerk Authentication Setup

This document explains how to set up Clerk authentication for the MBR application.

## Setup Instructions

### 1. Install Dependencies

First, install the Clerk SDK:

```bash
npm install @clerk/nextjs
```

### 2. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application in the Clerk Dashboard
3. Select "Next.js" as your framework

### 3. Get Your API Keys

1. In the Clerk Dashboard, go to "API Keys"
2. Copy your Publishable Key and Secret Key

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the `.env.local` file with your Clerk keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   ```

### 5. Run the Application

```bash
npm run dev
```

Your application now has authentication! Visit http://localhost:3000 and you'll see:
- Sign In / Sign Up buttons in the header
- Protected routes that require authentication
- User profile management

## Features Implemented

- ✅ Persistent authentication sessions
- ✅ Sign up / Sign in functionality
- ✅ Protected routes with middleware
- ✅ User profile management
- ✅ Custom sign-in/sign-up pages
- ✅ Automatic session management

## File Structure

```
├── middleware.ts          # Protects routes and handles authentication
├── app/
│   ├── layout.tsx        # Wraps app with ClerkProvider
│   ├── sign-in/          # Custom sign-in page
│   └── sign-up/          # Custom sign-up page
└── .env.local            # Your Clerk API keys (create from .env.local.example)
```

## Customization

You can customize the authentication flow by:
- Modifying the `middleware.ts` to change which routes are protected
- Updating the sign-in/sign-up pages appearance
- Adding custom fields to user profiles
- Implementing webhooks for user events

## Troubleshooting

If you're having issues:
1. Make sure your API keys are correctly set in `.env.local`
2. Restart your development server after adding environment variables
3. Check the browser console for any errors
4. Verify your Clerk application is active in the dashboard

## Next Steps

- Add role-based access control
- Implement organization features
- Set up webhooks for user events
- Customize the authentication UI further
