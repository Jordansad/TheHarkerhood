# CyberPath

Compagnon personnel d'apprentissage en cybersécurité : roadmap de compétences, dashboard de progression, et (à venir) méthodologies, checklists, journal, wiki, CTF, certifications, quiz et mentor IA.

## Stack

- `apps/web` — React + Vite + TypeScript + Tailwind CSS v4 + Radix UI + Framer Motion + React Router
- `apps/api` — Node + Express + TypeScript + Prisma + PostgreSQL, auth par JWT (cookie httpOnly)
- `packages/types` — types partagés entre le front et l'API

## Développement local

1. Copier `apps/api/.env.example` vers `apps/api/.env` et renseigner `DATABASE_URL` (Neon) et `JWT_SECRET`.
2. Copier `apps/web/.env.example` vers `apps/web/.env` (par défaut pointe sur `http://localhost:4000`).
3. `npm install` à la racine (workspaces npm).
4. `npm run prisma:migrate --workspace=apps/api` pour créer le schéma sur la base, puis `npm run prisma:seed --workspace=apps/api` pour charger la roadmap de départ.
5. `npm run dev` à la racine lance l'API (port 4000) et le front (port 5173) en parallèle.

## Déploiement

- `apps/web` : Vercel (build statique, `vercel.json` gère le rewrite SPA pour React Router).
- `apps/api` : Render (`render.yaml` à la racine), variables d'environnement à renseigner dans le dashboard Render.
- Base de données : Neon (Postgres), accessible depuis Render via `DATABASE_URL`.
