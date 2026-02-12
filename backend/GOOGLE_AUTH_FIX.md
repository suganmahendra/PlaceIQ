# 🔧 Fix: Enable Google Authentication

The error `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}` means Google Sign-In is turned **OFF** in your Supabase project.

Follow these 3 steps to fix it immediately.

---

## 🚀 Step 1: Enable Google Provider in Supabase

1. Go to your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Select your **PlaceIQ** project.
3. Click **Authentication** (Key icon) in the left sidebar.
4. Click **Providers** under Configuration.
5. Find **Google** and click to expand.
6. Toggle **"Enable Sign in with Google"** to **ON**.

> **Note:** You will need a **Client ID** and **Client Secret**. If you don't have them, create them in [Google Cloud Console](https://console.cloud.google.com/) (see `QUICK_GOOGLE_OAUTH_SETUP.md` for details).

---

## 🌍 Step 2: Update Redirect URLs (CRITICAL)

For the new secure auth flow to work, Supabase needs to know about your local URLs.

1. In Supabase Dashboard, go to **Authentication** -> **URL Configuration**.
2. Under **Site URL**, set it to:
   ```
   http://localhost:5173
   ```
3. Under **Redirect URLs**, click **"Add URL"** and add:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/auth/update-password
   ```
4. Click **Save**.

---

## 🔄 Step 3: Google Cloud Console Configuration

Ensure your Google Cloud Console allows the Supabase callback:

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Open your OAuth 2.0 Client.
3. Under **Authorized redirect URIs**, ensure you have:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   *(Find this URL in Supabase -> Authentication -> Providers -> Google)*

4. Click **Save**.

---

### ✅ Restart and Test

1. Restart your terminal (`Ctrl+C`, then `npm run dev`).
2. Go to **Sign Up with Google**.
3. It should now work perfectly!
