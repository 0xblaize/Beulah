# Beulah — waitlist

Cinematic waitlist for Beulah, the B2B creator marketplace. A 3D obsidian head is
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
| `src/app/page.tsx` | The page: letterbox bars, headline, form |
| `src/components/scene/` | The 3D scene (`Stage` canvas + effects, `Scene` lights/camera/scan, `Head` model + particles, `shaders.ts`) |
| `src/components/WaitlistForm.tsx` | Brand/creator toggle and email form |
| `src/app/api/waitlist/route.ts` | `POST /api/waitlist` — validates and saves a sign-up |
| `src/lib/waitlist-store.ts` | Storage for sign-ups |
| `public/models/head.glb` | Head scan |

## Sign-ups

Sign-ups are written to `data/waitlist.json` (git-ignored). Each email is stored once;
signing up again returns the original place in line.

That file store is for local demos. Serverless hosts such as Vercel have a read-only
filesystem, so replace `src/lib/waitlist-store.ts` with a database (Supabase, Postgres,
Airtable…) before deploying. The route and form don't need to change.

## Credits

Head scan by Lee Perry-Smith, licensed
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Keep the credit in the footer.
