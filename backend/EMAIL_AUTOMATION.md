# 📧 Brevo Email Automation Setup for PlaceIQ

This guide explains how to integrate **Brevo** with **Supabase** for automated, branded emails (Welcome, Verification, Security Alerts).

## 🔹 Prerequisites
1.  **Brevo Account**: Sign up at [brevo.com](https://www.brevo.com/).
2.  **API Key**: Get your API Key (v3) from Settings > SMTP & API.
3.  **Supabase Edge Functions**: Ensure you have the Supabase CLI installed.

---

## 🔹 Strategy: Supabase Edge Functions
We use an Edge Function that triggers on database events (e.g., new record in `student_profiles`) or via a direct API call from the frontend.

### 1. Create the Edge Function
Run in your terminal:
```bash
supabase functions new send-email
```

### 2. Implementation (`functions/send-email/index.ts`)
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')

serve(async (req) => {
  const { to, subject, templateId, params } = await req.json()

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY!,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: "PlaceIQ", email: "welcome@placeiq.ai" },
      to: [{ email: to }],
      subject: subject,
      templateId: templateId,
      params: params
    })
  })

  const result = await response.json()
  return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } })
})
```

---

## 🔹 Brevo Templates to Create
Create these templates in your Brevo Dashboard:

| Template Name | Template ID (Example) | Purpose |
| :--- | :--- | :--- |
| **Welcome Student** | `1` | Sent after `registerStudent()` |
| **Welcome Mentor** | `2` | Sent after `registerMentor()` |
| **Email Verification** | `3` | Sent by Supabase Auth (OTP/Link) |
| **Password Reset** | `4` | Sent by Supabase Auth |
| **Security Alert** | `5` | Sent when `user_security_logs` has a suspicious entry |

---

## 🔹 Triggering Emails from Database (Webhooks)
To automate "Welcome" emails, set up a **Database Webhook** in the Supabase Dashboard:
1.  Go to **Database > Webhooks**.
2.  Create a new webhook:
    - **Name**: `on_student_signup`
    - **Table**: `student_profiles`
    - **Events**: `INSERT`
    - **Type**: `HTTP Request`
    - **Method**: `POST`
    - **URL**: Your Edge Function URL (`https://[PROJECT_REF].supabase.co/functions/v1/send-email`)
    - **Headers**: `Authorization: Bearer [SERVICE_ROLE_KEY]`

---

## 🔹 Security & Compliance
-   **Rate Limiting**: Brevo handles this, but ensure your Edge Function has a timeout.
-   **Logging**: All sent emails are logged in Brevo's "Transactional" dashboard.
-   **Bounce Handling**: Configure Brevo to notify your backend if an email bounces.

---

## ✅ Final Result
When a student registers, Supabase creates the profile, which triggers the webhook, calling the Edge Function, which sends a branded Welcome Email via Brevo. **Fully Automated.**
