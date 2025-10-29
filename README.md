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

