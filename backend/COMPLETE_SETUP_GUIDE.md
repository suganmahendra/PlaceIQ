# 🚀 PlaceIQ Backend Setup - Complete Guide

This guide will walk you through setting up the complete authentication backend for PlaceIQ, including email/password and Google OAuth authentication.

## 📋 Prerequisites

- A Supabase account ([Sign up here](https://app.supabase.com/))
- Node.js and npm installed
- Google Cloud Console account (for OAuth)

---

## Part 1: Supabase Project Setup

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Fill in the details:
   - **Organization**: Select or create one
   - **Name**: `PlaceIQ`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"** and wait for initialization (~2 minutes)

### Step 2: Run Database Schema

1. Once ready, go to **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of `backend/schema.sql` from this repository
4. Paste into the editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)

✅ **What this does:**
- Creates 17+ tables for the entire PlaceIQ platform
- Sets up Row Level Security (RLS) policies
- Creates automatic user initialization trigger
- Adds performance indexes
- Populates default departments

### Step 3: Configure Environment Variables

1. In Supabase Dashboard, go to **Project Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

3. In your PlaceIQ project root, create/edit `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **IMPORTANT**: Add `.env` to `.gitignore` if not already there

---

## Part 2: Email Authentication Setup

### Step 1: Enable Email Provider

1. Go to **Authentication** → **Providers** in Supabase
2. Ensure **Email** is enabled (should be by default)

### Step 2: Configure Email Settings (Development)

For **development/testing**, you can disable email confirmation:

1. Go to **Authentication** → **Settings**
2. Find **"Confirm email"** toggle
3. Turn it **OFF** (this allows instant registration without email verification)

⚠️ **For production**, keep email confirmation **ON** for security!

### Step 3: Test Email Authentication

1. Run your app: `npm run dev`
2. Navigate to `/register-student`
3. Fill in the form and submit
4. Check:
   - **Authentication** → **Users** (should see new user)
   - **Table Editor** → **students** (should see profile)
   - **Table Editor** → **user_roles** (should see role entry)

---

## Part 3: Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. If prompted, configure the OAuth consent screen:
   - **User Type**: External
   - **App name**: PlaceIQ
   - **User support email**: Your email
   - **Developer contact**: Your email
   - **Scopes**: Add `email` and `profile`
   - Save and continue

6. Create OAuth Client ID:
   - **Application type**: Web application
   - **Name**: PlaceIQ Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     https://your-production-domain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Click **"Create"**

7. **Save** the Client ID and Client Secret

### Step 2: Configure Google OAuth in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **"Enable Sign in with Google"** to ON
4. Enter your Google credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Click **"Save"**

### Step 3: Test Google OAuth

1. Restart your app: `npm run dev`
2. Go to `/register-student` or `/login`
3. Click **"Sign up with Google"** button
4. You should be redirected to Google sign-in
5. After authentication, you'll be redirected back to the dashboard

---

## Part 4: Profile Completion Flow

The profile completion page (`/complete-profile`) allows users to add additional information after registration.

### When to Redirect Users

You can optionally redirect users to `/complete-profile` after their first login:

```typescript
// In your login handler
if (isFirstLogin) {
  navigate('/complete-profile');
} else {
  navigate('/student/dashboard');
}
```

---

## 🧪 Testing Checklist

### Email Authentication
- [ ] Student registration works
- [ ] Mentor registration works
- [ ] Student login works
- [ ] Mentor login works
- [ ] Password recovery works
- [ ] User profile is created automatically
- [ ] Role is assigned correctly

### Google OAuth
- [ ] Google sign-in button appears
- [ ] Clicking redirects to Google
- [ ] After auth, redirects to correct dashboard
- [ ] User profile is created automatically
- [ ] Works for both students and mentors

### Database
- [ ] Check `auth.users` table has entries
- [ ] Check `user_roles` table has correct roles
- [ ] Check `students` or `mentors` table has profiles
- [ ] Check `user_security_logs` for login events

---

## 🔒 Security Best Practices

### For Production:

1. **Enable Email Confirmation**
   - Go to **Authentication** → **Settings**
   - Turn **ON** "Confirm email"

2. **Configure Email Templates**
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails

3. **Set Up Custom SMTP** (Optional but recommended)
   - Go to **Project Settings** → **Auth**
   - Configure your own SMTP server for better deliverability

4. **Enable Rate Limiting**
   - Supabase has built-in rate limiting
   - Monitor in **Project Settings** → **API**

5. **Review RLS Policies**
   - All tables have Row Level Security enabled
   - Review policies in **Table Editor** → Select table → **Policies**

---

## 🐛 Troubleshooting

### "Failed to fetch" Error
- Check if Supabase URL and key are correct in `.env`
- Ensure `.env` file is in project root
- Restart dev server after changing `.env`

### Google OAuth Not Working
- Verify redirect URI matches exactly (including https://)
- Check that Google OAuth is enabled in Supabase
- Ensure Client ID and Secret are correct
- Check browser console for errors

### User Created but No Profile
- Check if `handle_new_user()` trigger is created
- Run the schema.sql again
- Check Supabase logs: **Database** → **Logs**

### Email Not Sending
- Check spam folder
- Verify email provider is enabled
- For production, set up custom SMTP

---

## 📊 Database Schema Overview

The complete schema includes:

**Authentication & Identity:**
- `user_roles` - Role management (student/mentor/admin)
- `user_security_logs` - Security event tracking
- `students` - Student profiles with XP, readiness scores
- `mentors` - Mentor profiles with expertise, ratings

**Learning System:**
- `courses` - Course catalog
- `course_modules` - Course structure
- `course_lessons` - Individual lessons
- `enrollments` - Student course enrollments
- `lesson_progress` - Lesson completion tracking

**Assessment:**
- `quizzes` - Quiz definitions
- `quiz_questions` - Quiz questions
- `quiz_attempts` - Student quiz attempts

**Career & Placement:**
- `job_listings` - Job opportunities
- `job_applications` - Student applications

**Gamification:**
- `xp_history` - XP transaction log
- `achievements` - Achievement definitions
- `student_achievements` - Unlocked achievements

**Social:**
- `student_alliances` - Student connections

---

## 🎉 You're All Set!

Your PlaceIQ backend is now fully configured with:
- ✅ Email/Password authentication
- ✅ Google OAuth authentication
- ✅ Automatic profile creation
- ✅ Role-based access control
- ✅ Security logging
- ✅ Complete database schema

**Next Steps:**
1. Test all authentication flows
2. Customize email templates for your brand
3. Set up production environment variables
4. Deploy your application!

---

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Google OAuth Guide**: https://developers.google.com/identity/protocols/oauth2
- **PlaceIQ Issues**: Create an issue in the repository

---

**Happy Building! 🚀**
