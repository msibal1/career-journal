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

- Accounts, multi-device sync (would use Supabase free tier)
- Subscription billing (would use Stripe Checkout)
- AI-generated bullets and STAR stories (would call OpenAI/Anthropic per-request, ~$0.001 per generation)
- Email reminders (need a backend)

These are the natural v2 additions once people actually use v1.

## Deploying

Front-end only, so any static host works. Easiest options:

- **Netlify Drop** — drag the `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop) after `npm run build`. Free, instant URL.
- **Vercel / Cloudflare Pages** — connect the GitHub repo, point at this folder, default build command (`npm run build`), output dir `dist/`.

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
