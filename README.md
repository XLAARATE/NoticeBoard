# Notice Board — Reno Platforms Assignment

A full-stack Notice Board built with Next.js (Pages Router), Prisma, and MySQL (TiDB Cloud).

**Live demo:** https://your-app.vercel.app  
**Stack:** Next.js 14 · Prisma 5 · TiDB Cloud (MySQL) · Tailwind CSS · TypeScript · Vercel

---

## Features

- Create, read, update, and delete notices
- Urgent notices always sort above Normal notices (ordered at the database level via Prisma `orderBy`)
- Red **Urgent** badge on urgent notice cards
- Server-side input validation — required fields and date validity enforced in API routes
- Responsive card grid (1 → 2 → 3 columns across phone / tablet / desktop)
- Delete confirmation dialog before any notice is removed
- Shared Add/Edit form — pre-fills with existing values when editing
- Bonus: optional image URL per notice

---

## Running locally

**Prerequisites:** Node.js 18+, a free [TiDB Cloud](https://tidbcloud.com) (or Neon/Supabase) account.

```bash
# 1. Clone
git clone https://github.com/your-username/noticeboard.git
cd noticeboard

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and paste your DATABASE_URL from TiDB Cloud → Connect → Prisma

# 4. Push schema to database
npx prisma db push

# 5. Start dev server
npm run dev
# Open http://localhost:3000
```

---

## Deployment (Vercel)

1. Push to a **public** GitHub repository
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` as an Environment Variable in Vercel project settings
4. Deploy — Vercel auto-detects Next.js

---

## One thing I would improve with more time

**Image upload via Cloudinary.** Currently the image field accepts a URL. With more time I would wire up direct file upload using Cloudinary's unsigned upload API so users can upload images from their device. This requires a `multipart/form-data` handler on the API route, a Cloudinary account, and storing the returned URL — all achievable but scoped out given the deadline.

---

## AI usage

Used Claude (claude.ai) to:
- Generate the initial Prisma schema and API route handler boilerplate
- Debug a TiDB SSL connection string issue during local setup
- Suggest Tailwind utility class combinations for the card layout and badge styles

All architectural decisions (Pages Router vs App Router, `priorityOrder` integer field for unambiguous sorting, singleton Prisma client pattern, `getServerSideProps` for edit page pre-fill) were made and verified independently. Every line was reviewed and understood before committing.
