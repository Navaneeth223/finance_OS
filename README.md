# Finance OS

AI-powered personal finance operating system built with Next.js 14, Prisma, GPT-4o, Recharts, Zustand, React Query, Framer Motion, and Radix UI.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2d3748) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-10a37f)

## Screenshots

Add portfolio screenshots in `/public/screenshots`:

- `dashboard.png`
- `transactions.png`
- `advisor.png`
- `reports.png`

## Features

- Cinematic dashboard with animated net worth, financial health score, budget rings, 30-day cash-flow chart, and AI weekly insight.
- Transactions workspace with CSV drag-and-drop import, GPT-4o categorization route, inline edits, smart search, optimistic updates, and bulk actions.
- Budget planner with rollover balances, amber/red threshold progress, and toast notifications with undo.
- AI advisor chat with prompt chips and token-by-token streaming responses.
- Reports with area, donut, and YoY bar charts plus branded PDF export.
- Dark mode default, system preference support, Cmd+K navigation, skeleton loading states, error boundaries, and responsive layouts.

## Local Setup

```bash
npm install
cp .env.example .env
docker compose up -d postgres
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

The app includes local demo fallbacks when `OPENAI_API_KEY` and Upstash credentials are absent, so reviewers can explore the product immediately.

## Environment

See `.env.example` for:

- Supabase or local PostgreSQL `DATABASE_URL`
- NextAuth secret, Google OAuth, and email magic link SMTP settings
- OpenAI `OPENAI_API_KEY`
- Upstash Redis REST credentials for AI endpoint rate limiting

## Deployment

Vercel:

1. Import the GitHub repo.
2. Add every variable from `.env.example`.
3. Set build command to `npm run build`.
4. Set install command to `npm install`.
5. Add `NEXTAUTH_URL` with the production Vercel URL.

Railway PostgreSQL:

1. Create a PostgreSQL service.
2. Copy the public connection string to Vercel as `DATABASE_URL`.
3. Run `npx prisma migrate deploy` from a trusted environment.
4. Run `npm run prisma:seed` once for demo data.

## Interview Talking Points

1. The AI routes are rate-limited and schema-validated before touching GPT-4o, which protects cost and reliability.
2. Server state uses React Query with optimistic updates, while Zustand only owns global UI state, keeping responsibilities clean.
3. The product can demo without third-party keys because AI fallbacks preserve the UX while real credentials unlock production behavior.
4. Charts are wrapped as memoized, domain-specific components so dashboard and report screens stay readable.
5. Prisma models mirror real finance concepts while retaining NextAuth compatibility, making the prototype easy to move from demo data to Supabase-backed user data.
