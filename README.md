# Career Journal — MVP

A web app where you log weekly career wins, metrics, and skills, then export polished bullet points and self-review drafts when it's time for a performance review or a job hunt.

**Sign-in required:** Visitors land on a marketing page first; the journal only loads after email magic-link auth (Supabase). Old anonymous/local-first sessions still migrate on first sign-in if `localStorage` had data from earlier builds.

## Stack

- **Vite + React + TypeScript**
- **Supabase Auth** (magic link) + Postgres for entries/profile rows
- **Optional migration:** reads legacy `localStorage` (`career-journal/v1`) once on first sign-in if the cloud account is empty
- Custom CSS (no Tailwind / no UI library) — design tokens live in `src/index.css`

## Run it locally

Node was installed at `~/.local/node`. Either rely on the line added to `~/.zshrc`, or set the PATH manually:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
cd /Users/mo/Desktop/Cursor/career-journal
npm install        # first time only
npm run dev        # opens at http://localhost:5173
```

Other commands:

```bash
npm run build      # production build to ./dist
npm run preview    # serve the production build
npx tsc --noEmit   # type-check
```

## Project layout

```
career-journal/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                    # entry point
    ├── App.tsx                     # auth gate: landing vs JournalApp
    ├── index.css                   # design system + all styles
    ├── lib/
    │   ├── types.ts                # Entry, Settings, Store
    │   ├── storage.ts              # useStore() — Supabase sync when signed in
    │   ├── date.ts                 # ISO week helpers
    │   └── export.ts               # bullets / STAR / markdown / self-review formatters
    ├── components/
    │   ├── EntryForm.tsx           # weekly composer
    │   ├── EntryCard.tsx           # read-only entry display
    │   ├── EmptyState.tsx
    │   ├── TagInput.tsx            # chip-style tag input
    │   └── CopyOutput.tsx          # textarea + copy/download buttons
    └── views/
        ├── Landing.tsx             # marketing page (pre-auth)
        ├── JournalApp.tsx          # shell + nav after sign-in
        ├── HomeView.tsx            # this week + recent
        ├── ArchiveView.tsx         # search + browse all
        ├── ReviewView.tsx          # self-review draft generator
        ├── ExportView.tsx          # bullets / STAR / markdown
        └── SettingsView.tsx        # name, nudge, import/export, reset
```

## What's in the MVP

- **Weekly composer:** wins (multi-line), metrics (label + value), skills, projects, notes — all in one card on the Home view.
- **Archive:** all entries grouped by month, searchable, editable.
- **Review draft:** auto-generates a self-review markdown doc from your entries over a chosen period.
- **Export:** resume bullets, STAR-format interview stories, or full markdown.
- **Settings:** profile name, optional Friday nudge, JSON export/import, full reset.

## What it intentionally doesn't have yet

- Subscription billing (Stripe Checkout)
- AI-generated bullets and STAR stories (optional API calls)
- Email reminders (needs a backend or Supabase Edge)

## Go live (production)

This is a **static Vite build** (`npm run build` → `dist/`). Env vars **must** be set on the host (they are **not** in GitHub — `.env.local` is gitignored).

### Recommended: Vercel + GitHub

1. Sign up at [vercel.com](https://vercel.com) with **Continue with GitHub**.
2. **Add New Project** → import **`msibal1/career-journal`**.
3. Vercel should detect **Vite** automatically. Confirm:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Under **Environment Variables**, add (same values as your local `.env.local`):
   - `VITE_SUPABASE_URL` = your Supabase project URL (e.g. `https://xxhozrirrpxwpgvgwrnc.supabase.co`)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your **publishable / anon** key from Supabase **Project Settings → API**

   **Important:** Vite bakes these in at **build** time. Add both variables **before** the first deploy, or after adding them open **Deployments → … → Redeploy** so a new build runs with the vars set.

5. Click **Deploy**. You’ll get a URL like `https://career-journal-xxx.vercel.app`.

### Supabase (required or magic links break)

In Supabase: **Authentication → URL Configuration**

- **Site URL:** your production URL (e.g. `https://career-journal-xxx.vercel.app`)
- **Redirect URLs:** add `https://your-live-domain.vercel.app/**`  
  Keep `http://localhost:5173/**` for local dev.

Redeploy on Vercel after changing env vars if needed (**Deployments → … → Redeploy**).

### Alternatives

- **Netlify:** Connect the same GitHub repo; `netlify.toml` sets build/publish. Add the same `VITE_*` variables in site settings.
- **Cloudflare Pages:** Build `npm run build`, output `dist`, same env vars.

### Smoke test after deploy

Open the live URL in an **incognito** window → landing → **Start free — email only** → magic link → log one entry.

## Distribution ideas (the part that takes real work)

- LinkedIn posts: "things I track every Friday so I never lose a win to memory"
- Reddit: r/cscareerquestions, r/jobs, r/managers — share the brag-document concept
- Newsletter swap with career coaches
- Pair the journal app with the OfferEdge negotiation toolkit as a free download bonus

## Honest expectations

This is a retention product. Realistic timeline:

- **Week 1–4:** publish, share, get the first 50–500 visitors.
- **Month 2–3:** see if anyone actually returns. If yes, add accounts and a paid tier. If not, iterate or kill.
- **Month 6+:** if it's sticky, paid conversion at $5/mo is plausible. If not, the experiment was cheap.

## Disclaimer

Career Journal is a self-reflection tool. Not a substitute for legal, financial, or career advice.
