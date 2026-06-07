## Notice Board

A full-stack notice board built with Next.js, Prisma, and TiDB Cloud.

## Tech Stack
- Next.js 16 (Pages Router)
- Prisma 7 with TiDB Cloud (MySQL)
- Tailwind CSS v4

## How to run locally
1. Clone the repo
2. Run `npm install`
3. Add `.env` with your database credentials
4. Run `npx prisma db push`
5. Run `npx prisma generate`
6. Run `npm run dev`

## What I would improve with more time
- Add image file upload instead of URL input
- Add pagination for large number of notices
- Add search and filter by category

## AI usage
Used Claude (Anthropic) to assist with setup, debugging, and code structure throughout the project.