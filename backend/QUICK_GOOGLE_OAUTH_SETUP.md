# 🚀 Quick Google OAuth Setup (15 Minutes)

## Problem: "Site Can't Be Reached" When Clicking Google Sign-In

This happens because Google OAuth isn't configured yet. Here's how to fix it:

---

## Step 1: Enable Google Provider in Supabase (2 minutes)

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your PlaceIQ project
3. Go to **Authentication** → **Providers** (left sidebar)
4. Find **Google** in the list
5. Click to expand it
6. Toggle **"Enable Sign in with Google"** to **ON**
7. **DON'T SAVE YET** - You need credentials first

---

## Step 2: Create Google OAuth Credentials (10 minutes)

### A. Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### B. Create/Select a Project

1. Click the project dropdown at the top
2. Click **"New Project"**
3. Name it: `PlaceIQ`
4. Click **"Create"**
5. Wait for project creation (~30 seconds)
6. Select the new project from the dropdown

### C. Configure OAuth Consent Screen

1. In the left menu, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click **"Create"**

4. Fill in the form:
   - **App name**: `PlaceIQ`
   - **User support email**: Your email
   - **App logo**: (optional, skip for now)
   - **App domain**: Leave blank for development
   - **Authorized domains**: Leave blank for development
   - **Developer contact information**: Your email

5. Click **"Save and Continue"**

6. **Scopes** page:
   - Click **"Add or Remove Scopes"**
   - Select these scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click **"Update"**
   - Click **"Save and Continue"**

7. **Test users** page:
   - **For Development:** Add each email manually.
   - **For Everyone (Students/Mentors):** You must **PUBLISH** the app. See Step D below.
   - Click **"Save and Continue"**

8. **Summary** page:
   - Review and click **"Back to Dashboard"**

### D. IMPORTANT: Enable Global Access (Publish App)
To allow **ANY** student or mentor to sign in:
1. Go back to **APIs & Services** -> **OAuth consent screen**.
2. Under "Publishing status", click the **"PUBLISH APP"** button.
3. Click **"Confirm"**.
4. Status will change to **"In production"**.
   - **Result:** Now anyone with a Google account can sign in without needing manual approval.
   - *Note:* Google will show a "Google hasn't verified this app" warning. Users can click "Advanced" -> "Go to PlaceIQ (unsafe)" to proceed. This is standard for unverified apps.

### E. Create OAuth Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**

3. Fill in the form:
   - **Application type**: `Web application`
   - **Name**: `PlaceIQ Web Client`

4. **Authorized JavaScript origins**:
   - Click **"Add URI"**
   - Add: `http://localhost:5173`
   - Click **"Add URI"** again
   - Add: `https://your-project-id.supabase.co` (replace with your actual Supabase URL)

5. **Authorized redirect URIs**:
   - Click **"Add URI"**
   - Add: `https://your-project-id.supabase.co/auth/v1/callback`
   - (Replace `your-project-id` with your actual Supabase project ID)
   - **IMPORTANT**: This must be EXACTLY your Supabase URL + `/auth/v1/callback`

6. Click **"Create"**

7. **SAVE THESE VALUES** (you'll need them):
   - **Client ID**: Starts with something like `123456789-abc.apps.googleusercontent.com`
   - **Client Secret**: Random string
   - Click **"OK"**

---

## Step 3: Add Credentials to Supabase (2 minutes)

1. Go back to your Supabase Dashboard
2. Go to **Authentication** → **Providers**
3. Find **Google** and expand it
4. You should still have it toggled ON from Step 1

5. Paste your credentials:
   - **Client ID (for OAuth)**: Paste the Client ID from Google
   - **Client Secret (for OAuth)**: Paste the Client Secret from Google

6. Click **"Save"**

---

## Step 4: Get Your Supabase Redirect URI

You need to add this to Google Cloud Console:

1. In Supabase, the redirect URI is shown in the Google provider settings
2. It looks like: `https://xxxxx.supabase.co/auth/v1/callback`
3. Copy this URL

4. Go back to Google Cloud Console
5. Go to **APIs & Services** → **Credentials**
6. Click on your OAuth client ID
7. Under **Authorized redirect URIs**, make sure this exact URL is added
8. If not, add it and click **"Save"**

---

## Step 5: Test It! (1 minute)

1. Go back to your PlaceIQ app: `http://localhost:5173`
2. Go to `/register-student`
3. Click **"Sign up with Google"**
4. You should now see the Google sign-in screen!
5. Sign in with your Google account
6. You'll be redirected back to the dashboard

---

## ✅ Success Checklist

- [ ] Google provider enabled in Supabase
- [ ] OAuth consent screen configured
- [ ] OAuth client ID created
- [ ] Client ID and Secret added to Supabase
- [ ] Redirect URI matches exactly
- [ ] Test user added (your email)
- [ ] Google sign-in works!

---

## 🐛 Troubleshooting

### "Site Can't Be Reached" Still Happening?

**Check:**
1. Is Google provider enabled in Supabase? (Toggle should be ON)
2. Did you click "Save" in Supabase after adding credentials?
3. Did you restart your dev server? (`Ctrl+C` then `npm run dev`)

### "Redirect URI Mismatch" Error?

**Fix:**
1. Copy the exact redirect URI from Supabase
2. Go to Google Cloud Console → Credentials
3. Edit your OAuth client
4. Make sure the redirect URI matches EXACTLY (no trailing slash, correct protocol)

### "Access Blocked: This app's request is invalid"?

**Fix:**
1. Make sure OAuth consent screen is configured
2. Add your email as a test user
3. Make sure you selected "External" user type

### "Error 400: redirect_uri_mismatch"?

**Fix:**
1. The redirect URI in Google Cloud Console must EXACTLY match Supabase
2. Format: `https://your-project-id.supabase.co/auth/v1/callback`
3. No extra spaces, no trailing slash

---

## 📝 Quick Reference

**Where to find your Supabase redirect URI:**
- Supabase Dashboard → Authentication → Providers → Google
- It's shown as "Callback URL (for OAuth)"

**Where to add it in Google:**
- Google Cloud Console → APIs & Services → Credentials
- Click your OAuth client → Authorized redirect URIs

---

## ⏱️ Total Time: ~15 minutes

- Step 1: 2 minutes
- Step 2: 10 minutes
- Step 3: 2 minutes
- Step 4: 1 minute
- Step 5: 1 minute

---

**After this setup, Google OAuth will work perfectly!** 🎉
