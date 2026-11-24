# Saqib & Richie — Wedding Invitation

Responsive React/Vite invitation inspired by the screenshots supplied in chat. Deployable to Vercel.

## Run locally
- Install Node.js 20+
- `npm install`
- Copy `.env.example` to `.env.local` and fill in Supabase values (see below)
- `npm run dev`

## Receive guestbook wishes (Supabase)
1. Create a free project at https://supabase.com.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In **Project Settings → API**, copy the Project URL and publishable key into `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` (legacy `VITE_SUPABASE_ANON_KEY` is also supported)
4. The guestbook will save every message in **Table Editor → wedding_wishes**. It also displays new wishes live to everyone viewing the invitation.
5. Never put the Supabase service-role key in the website.
6. This project includes its public Supabase URL and publishable key as defaults, so Vercel can connect without environment variables. To use a different Supabase project, set both variables in **Vercel → Settings → Environment Variables** and redeploy. Local `.env.local` values are not included in production builds.

If the form says the guestbook is not connected, one or both Vite variables are missing. If it says a wish could not be sent, confirm `supabase/schema.sql` was run in the same Supabase project as the configured URL, then check the browser console and Supabase logs for the underlying error.

## Email notifications (optional but recommended)
1. Create an account at https://resend.com and verify a sender/domain.
2. Add `RESEND_API_KEY` and `WEDDING_NOTIFICATION_EMAIL` to `.env.local` and Vercel → Settings → Environment Variables.
3. Update `from` in `api/notify.js` to a sender/domain verified in Resend. Resend's onboarding sender is suitable for testing only.
4. Redeploy. Each saved guestbook wish will then also trigger an email notification.

## Google Maps
The venue section uses an interactive Google Maps embed and a directions link. It requires no API key in this implementation. For a custom Google Maps embed key, replace the iframe URL in `src/main.jsx`.

## Deploy
Import the project folder/repository into Vercel. Framework: Vite; Build command: `npm run build`; Output: `dist`. Vercel automatically serves the `/api/notify.js` serverless endpoint.

## Notes
- Attendance/RSVP section has been removed; the guestbook is the message option.
- Guestbook writes persist in Supabase when configured. Without Supabase credentials, the form deliberately shows a setup message instead of pretending to save messages.
- The live countdown targets Dec 8, 2026 at 8:30 PM Bangladesh time.
