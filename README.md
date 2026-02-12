# Social Media App - Next.js Full-Stack

Production-grade social media platform built with Next.js 15, Prisma, PostgreSQL, and NextAuth.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth v5
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Validation:** Zod
- **TypeScript:** Full type safety

## Architecture

**Full-stack Next.js:**
- Server Components for data fetching
- API Routes for REST endpoints
- Server Actions for mutations
- Client Components for interactivity

**Why Next.js instead of separate backend?**
- Single codebase (shared types, no CORS)
- Faster development (Server Components eliminate API round trips)
- Simpler deployment (one service)
- Mobile-ready (can call `/api/*` routes)

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL running on localhost:5432
- Database: `social_media_basic`

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed database
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Scripts

```bash
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema (no migration)
npm run db:migrate     # Create + apply migration
npm run db:studio      # Open Prisma Studio GUI
npm run db:seed        # Seed database with test data
```

## Environment Variables

Copy `.env.local` and update values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/social_media_basic?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (dashboard)/         # Protected routes (feed, profile, settings)
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── posts/           # Posts CRUD
│   │   ├── users/           # Users/profile
│   │   └── comments/        # Comments
│   └── actions/             # Server Actions (mutations)
├── components/              # React components
├── lib/                     # Utilities
│   ├── prisma.ts           # Prisma singleton
│   └── auth.ts             # Auth helpers
└── types/                  # TypeScript types

prisma/
├── schema.prisma           # Database schema
├── migrations/             # Migration history
└── seed.ts                 # Seed script
```

## Features

### Completed (Phase 1)
- ✅ User authentication (signup/login)
- ✅ Create, edit, delete posts
- ✅ Like/unlike posts
- ✅ Comments with nested replies
- ✅ User profiles (edit bio, avatar, cover)
- ✅ Settings (notifications, privacy, theme)
- ✅ Infinite scroll
- ✅ Responsive design (mobile-first)
- ✅ Dark mode

### In Progress (Phase 2)
- 🚧 Migration to Next.js full-stack
- 🚧 NextAuth integration
- 🚧 Server Components + Server Actions

### Planned (Phase 3+)
- Security hardening (rate limiting, validation, CSRF)
- Performance optimization (caching, code splitting)
- Real-time features (WebSockets, live notifications)
- Image uploads (Cloudinary)
- Email verification
- Follow/unfollow users
- Direct messaging

## Migration Notes

**2026-02-12:** Consolidated from separate Fastify backend → Next.js full-stack

- Deleted: `backend/` folder (Fastify + half-implemented tests)
- Moved: Prisma schema/migrations to `frontend/prisma/`
- Architecture: Server Components + API Routes + Server Actions

See `MIGRATION_PLAN.md` for detailed roadmap.

## Development

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
```

## Deployment

**Recommended platforms:**
- Vercel (zero-config Next.js hosting)
- Railway (PostgreSQL + Next.js)
- Fly.io (full control)

**Environment variables required:**
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## Contributing

Follow SOLID principles and Next.js best practices. See `docs/` for architecture decisions.

## License

MIT
