# Deployment Guide

## Vercel App

1. Push the repository to GitHub.
2. Create a new Vercel project from the repo.
3. Add environment variables from `.env.example`.
4. Use `npm install` as the install command.
5. Use `npm run build` as the build command.
6. Set `NEXTAUTH_URL` to the final production URL.
7. Add Google OAuth redirect URI: `https://your-domain.com/api/auth/callback/google`.

## Railway Database

1. Create a Railway PostgreSQL service.
2. Copy the external connection string.
3. Add it to Vercel as `DATABASE_URL`.
4. Run:

```bash
npx prisma migrate deploy
npm run prisma:seed
```

## Production Notes

- Keep `OPENAI_API_KEY` server-only.
- Configure Upstash Redis before public launch to protect AI endpoints.
- Use Supabase or Railway connection pooling for production traffic.
- Rotate `NEXTAUTH_SECRET` only with a planned session invalidation window.
