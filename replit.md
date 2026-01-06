# WinPlay - Rewards Gaming Platform

## Overview

WinPlay is a mobile-first web application where users play mini-games, watch ads, and complete daily activities to earn points that can be redeemed for real money. The platform features a gamification system with multiple earning mechanisms, a wallet system for withdrawals, and an admin panel for user and payout management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for smooth UI transitions
- **Icons**: Lucide React icon library

The frontend follows a mobile-first design pattern with a maximum width container (`max-w-md`) and bottom navigation for mobile UX. Protected routes handle authentication state and role-based access (user vs admin).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy, session-based auth using express-session
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **API Design**: RESTful endpoints defined in shared routes module with Zod validation

The server uses a storage abstraction layer (`IStorage` interface) that currently implements PostgreSQL via Drizzle ORM. This pattern allows for potential storage backend changes.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Migrations**: Drizzle Kit with migrations output to `./migrations`

**Core Tables**:
- `users` - User accounts with points balance, role, and block status
- `withdrawals` - Withdrawal requests with status tracking
- `activities` - Earning history log for all point-earning actions

### Authentication & Authorization
- Session-based authentication with secure password hashing (scrypt)
- Role-based access control: `user` and `admin` roles
- Middleware functions `requireAuth` and `requireAdmin` protect API routes
- User blocking capability for moderation

### Points Economy
- Points earned through: ad watching, daily login, game completion (tap, trivia, memory)
- Configurable reward rates defined in `shared/schema.ts` (`REWARD_RATES`, `POINTS_PER_USD`)
- Points converted to USD at withdrawal

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication & Sessions
- **Passport.js**: Authentication middleware
- **connect-pg-simple**: PostgreSQL session store

### UI Components
- **shadcn/ui**: Pre-built accessible React components based on Radix UI primitives
- **Radix UI**: Low-level UI primitives (dialogs, dropdowns, tabs, etc.)
- **Tailwind CSS**: Utility-first CSS framework

### Build & Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **TypeScript**: Type safety across the entire codebase

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption (defaults to fallback in dev)