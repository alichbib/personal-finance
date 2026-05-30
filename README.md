# Personal Finance

Frontend for the Personal Finance app — a clean, calm dashboard for tracking
expenses, categories, and budgets.

## Stack

- React 18 + TypeScript + Vite
- TailwindCSS
- React Router + React Hook Form
- Zustand (auth) + Axios

## Getting started

```bash
yarn install
cp .env.example .env        # set VITE_API_URL if the backend isn't on :3001
yarn dev                    # http://localhost:5173
```

The backend (`personal-finance-ms`) must be running for data to load.

## Scripts

| Script | Description |
|---|---|
| `yarn dev` | Start the dev server |
| `yarn build` | Type-check + production build |
| `yarn typecheck` | Type-check only |
| `yarn preview` | Preview the production build |

## Environment

- `VITE_API_URL` — base URL of the backend API (default `http://localhost:3001`)

## Structure

- `src/pages` — Login, Register, Dashboard, Expenses, Categories, Budgets
- `src/components/layout` — app shell + sidebar + auth layout
- `src/components/ui` — Button, Card, Spinner, EmptyState, ErrorState
- `src/api` — typed API calls per resource
- `src/lib` — Axios client, formatting, and error helpers
- `src/store/authStore.ts` — persisted auth session (token + user)
- `src/hooks/useFetch.ts` — small data-fetching hook with loading/error states
