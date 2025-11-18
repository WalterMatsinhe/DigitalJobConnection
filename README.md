# Digital Job Connection — Prototype

This is a frontend-only prototype that connects Kenyan youth with employers, mentors, training centers, and entrepreneurship resources.

Tech stack:
- React + Vite + TypeScript
- Tailwind CSS
- React Router
- TanStack Query (React Query)
- MSW (Mock Service Worker) for mocked API

Quick start (after cloning):

```powershell
# from project root
npm install
npm run dev
```

Open http://localhost:5173

What's included:
- Seeded jobs and users in `src/mocks/seed/seedData.json`
- MSW handlers in `src/mocks/handlers.ts`
- Pages: Home, Jobs, JobDetail, Mentors, Profile

Next steps:
- Wire more UI components (filters, modals, forms)
- Add tests (Vitest + React Testing Library)
- Add i18n for English/Swahili

Backend (local dev)
-------------------

This repo now includes a minimal Express/Mongoose server for auth endpoints under `server/`.

1. Create a `.env` in the `server/` folder (or set `MONGODB_URI` in your environment). You can copy `server/.env.example` and fill in your MongoDB connection string.

2. Install server packages from the project root (they're added to the root `package.json`):

```powershell
npm install
```

3. Start the server (from project root):

```powershell
npm run server
```

The frontend dev server proxies `/api` to `http://localhost:4000`, so after starting the server and `npm run dev` the Register and Login pages will call the backend endpoints.

Security note: Do not commit real credentials to the repo. Use environment variables or a secrets manager for production.

## Deployment

### Vercel Deployment

This application is configured to deploy on Vercel. For detailed deployment instructions and troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Important**: If your Vercel deployment is asking for authentication, you need to disable **Deployment Protection** in your Vercel project settings. See the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for step-by-step instructions.

Quick deployment steps:
1. Push your code to GitHub
2. Import the repository in Vercel
3. Add `MONGODB_URI` environment variable
4. Ensure Deployment Protection is disabled (see DEPLOYMENT.md)
5. Deploy!

