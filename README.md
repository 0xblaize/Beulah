# Beulah — waitlist

Cinematic waitlist for Beulah, the creator & brand marketplace. A 3D obsidian head is
cut by a laser scan line and dissolves into particles above it; brands and creators
leave their email below.

Built with Next.js 16 (App Router), React 19, React Three Fiber and
`@react-three/postprocessing`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| Path | What it does |
| --- | --- |
| `src/app/page.tsx` | Landing page: headline and the brand/creator buttons |
| `src/app/waitlist/page.tsx` | Waitlist page (`/waitlist?role=brand` or `creator`) |
| `src/components/Frame.tsx` | Letterbox bars shared by both pages |
| `src/components/scene/` | The 3D scene (`Stage` canvas + effects, `Scene` lights/camera/scan, `Head` model + particles, `shaders.ts`) |
| `src/components/WaitlistForm.tsx` | Brand/creator toggle and email form |
| `src/app/api/waitlist/route.ts` | `POST /api/waitlist` — validates and saves a sign-up |
| `src/lib/waitlist-store.ts` | Storage for sign-ups |
| `public/models/head.glb` | Head scan |

## Sign-ups

Sign-ups are stored in Supabase Postgres, in a `waitlist` table that the app creates on
the first sign-up. Each email is stored once; signing up again returns the original
place in line. View them in Supabase → Table Editor → `waitlist`.

Set `DATABASE_URL` (see `.env.example`) in `.env.local` for local runs and in Vercel →
Settings → Environment Variables for the live site. Use the **Transaction pooler**
connection string (port 6543); the direct `db.*.supabase.co` address doesn't work on
Vercel.

## Credits

Head scan by Lee Perry-Smith, licensed
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Keep the credit in the footer.
