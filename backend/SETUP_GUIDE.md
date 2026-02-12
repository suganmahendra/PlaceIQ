# Supabase Backend Setup Guide for PlaceIQ

Follow these steps to set up your Supabase project and integrate it with the PlaceIQ frontend.

## 1. Create a Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com/).
2. Click **"New Project"**.
3. Select your Organization and enter a Name (e.g., `PlaceIQ`).
4. Set a strong Database Password and choose a Region close to you.
5. Click **"Create new project"**.

## 2. Initialize the Database
1. Once the project is ready, go to the **SQL Editor** in the left sidebar.
2. Click **"New Query"**.
3. Copy the contents of `backend/schema.sql` from this repository and paste it into the editor.
4. Click **"Run"**.
   - This will create the `profiles` table.
   - It will set up Row Level Security (RLS).
   - It will create a trigger to automatically create a profile when a new user signs up via Auth.

## 3. Configure Environment Variables
1. Go to **Project Settings** (gear icon) -> **API**.
2. Copy the **Project URL** and the **`anon` public API Key**.
3. Open the `.env` file in the root of your PlaceIQ project.
4. Replace the placeholders with your actual values:
   ```env
   VITE_SUPABASE_URL=your_actual_url
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

## 4. Enable Authentication
1. Go to **Authentication** -> **Providers**.
2. Ensure **Email** is enabled.
3. (Optional) Disable "Confirm Email" for development purposes if you want to skip email verification.
   - Go to **Authentication** -> **Settings**.
   - Toggle off **"Confirm email"**.

## 5. Test the Integration
1. Run `npm install` to ensure `@supabase/supabase-js` is installed.
2. Start the app with `npm run dev`.
3. Try registering as a Student or Mentor.
4. Check the **Authentication** -> **Users** and **Table Editor** -> **profiles** in Supabase to see the data being stored!

---
**Note:** The trigger in `schema.sql` handles mapping the registration metadata (name, role, department/expertise) to the `profiles` table automatically.
