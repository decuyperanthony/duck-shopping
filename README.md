# Duck Shopping

A smart, offline-first shopping list app powered by AI. Type your grocery needs in natural language and let Claude or ChatGPT automatically parse, categorize, and organize your items.

Built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and an **offline-first architecture** using IndexedDB with optional PostgreSQL sync.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)

---

## Features

**AI-Powered Natural Language Parsing**
- Write freely: *"3 baguettes, 500g de boeuf haché bio, 2 bouteilles de lait d'amande"*
- Items are automatically parsed with title, quantity, category, and notes
- Dual AI provider support: **Claude** (Anthropic) or **ChatGPT** (OpenAI) with automatic fallback
- Local rule-based parser available for fully offline usage (no API key needed)

**Smart Categorization**
- 12 shopping categories: Boulangerie, Boucherie, Poissonnerie, Primeur, Fromagerie, Epicerie, Supermarche, Surgeles, Boissons, Hygiene, Maison, Autre
- Items are automatically sorted by store section for an efficient shopping trip

**Offline-First Architecture**
- Full functionality without internet using IndexedDB
- Optional bidirectional sync with PostgreSQL (Neon serverless)
- Service Worker for PWA support

**Templates**
- Save frequently used shopping lists as reusable templates
- Load a template to quickly populate your list

**Progress Tracking**
- Visual progress bar as you check off items
- Items grouped by category for easy navigation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.9 |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Local Storage | IndexedDB (via `idb`) |
| Database | PostgreSQL via Neon (optional) |
| ORM | Drizzle ORM |
| AI Providers | Anthropic Claude, OpenAI GPT-4o-mini |
| PWA | Service Worker, Web App Manifest |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

```bash
git clone https://github.com/decuyperanthony/duck-shopping.git
cd duck-shopping
npm install
```

### Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Configure your `.env`:

```env
# AI Provider (at least one API key required for AI parsing)
ANTHROPIC_API_KEY=sk-ant-...       # Claude (recommended)
OPENAI_API_KEY=sk-...              # ChatGPT (alternative)

# Optional: force a specific provider ("anthropic" or "openai")
# AI_PROVIDER=anthropic

# Optional: PostgreSQL for cloud sync
# DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

> **Note:** The app works fully offline without any API key using the local parser. AI keys are only needed for natural language input.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database (Optional)

If using Neon PostgreSQL for sync:

```bash
npm run db:generate   # Generate migrations
npm run db:migrate    # Apply migrations
```

---

## Project Structure

```
app/
├── api/
│   ├── health/           # Database health check
│   └── items/
│       ├── route.ts      # CRUD operations
│       ├── parse/        # AI-powered parsing (Claude / GPT)
│       ├── parse-local/  # Rule-based offline parsing
│       └── sync/         # Bidirectional sync
├── settings/             # Settings & data management
├── layout.tsx
└── page.tsx              # Main shopping list

components/
├── prompt-input.tsx      # Natural language input
├── category-group.tsx    # Items grouped by category
├── item-row.tsx          # Individual item display
├── template-panel.tsx    # Saved list templates
├── progress-bar.tsx      # Shopping progress
└── ...

lib/
├── db/                   # Drizzle schema & database init
├── indexeddb.ts          # IndexedDB operations
├── local-parser.ts       # Rule-based parsing engine
├── sync.ts               # Sync utilities
├── categories.ts         # Category definitions
├── types.ts              # TypeScript interfaces
├── use-shopping-list.ts  # Shopping list hook
└── use-templates.ts      # Templates hook
```

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/items` | Fetch all items |
| `POST` | `/api/items` | Create an item |
| `PATCH` | `/api/items` | Update an item |
| `DELETE` | `/api/items` | Delete an item |
| `POST` | `/api/items/parse` | AI-powered natural language parsing |
| `POST` | `/api/items/parse-local` | Local rule-based parsing |
| `POST` | `/api/items/sync` | Bidirectional sync |
| `GET` | `/api/health` | Database connection status |

---

## How It Works

### AI Parsing Flow

1. User types a free-form shopping request
2. The request is sent to the configured AI provider (Claude or GPT)
3. The AI returns structured JSON with parsed items (title, category, quantity, notes)
4. Items are added to the local IndexedDB store
5. If a database is configured, items sync in the background

### Local Parsing

A comprehensive rule-based parser (~600 lines) handles French grocery items without any API call. It uses a dictionary of ~200+ items mapped to categories, with support for quantities, units, and notes.

---

## Deployment

Deploy to **Vercel** with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/decuyperanthony/duck-shopping)

Set your environment variables in the Vercel dashboard after deployment.

---

## License

MIT
