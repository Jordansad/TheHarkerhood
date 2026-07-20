# The Hackerhood — État du projet

Plateforme communautaire d'apprentissage cybersécurité. Monorepo npm workspaces :
`apps/web` (React/Vite), `apps/api` (Express/Prisma), `packages/types`.

Repo : `git@github.com:Jordansad/TheHarkerhood.git`
Web (Vercel) : https://the-harkerhood-web.vercel.app
API (Vercel, migré depuis Render) : https://the-harkerhood-api-two.vercel.app

## État fonctionnel : toutes les phases du plan initial sont livrées

- Roadmap 12 mois, méthodologies + checklists, système de progression Bronze→Legend, journal/wiki, CTF + certifications + annuaire équipe, quiz (+ gestion admin des quiz), Mentor IA (Google Gemini, gratuit), dashboard fondateur (`/admin`), branding (logo en filigrane partout), design animé/futuriste.
- Rôles : `UserRole` founder→member, bootstrap via `ADMIN_EMAILS`.
- DB : Neon Postgres, accès via `@prisma/adapter-pg`.

## Bugs récents corrigés (commits `116f2eb` → `9b593d2`)

1. Route racine `/` manquante → causait un faux "down" sur UptimeRobot (404 au lieu de 200). Fixé (fonctionne sur Render ; sur Vercel `/` plante encore pour une raison non résolue, voir plus bas — non bloquant).
2. Navigation mobile : sidebar fixe 240px sans repli → écrasait l'écran sur téléphone. Remplacée par un tiroir + bouton hamburger.
3. Pages bloquées en chargement infini si une requête API échouait (aucun `.catch()` nulle part) → ajout de `useApiGet` + `ErrorState` partout.
4. **Bug racine du "dashboard vide sur mobile"** : cookie de session cross-site (`sameSite=None`) refusé par les navigateurs mobiles (Safari surtout), même en HTTPS. Fix : login/register renvoient aussi un `token` dans le corps de la réponse, stocké côté client et envoyé via header `Authorization: Bearer` sur chaque requête (le cookie reste en place en complément).

## ✅ TERMINÉ : migration hors de Render vers Vercel

**Pourquoi Render a été abandonné** : le plan gratuit offre 750h/mois **partagées entre tous les services gratuits du compte**. Trois services (`theharkerhood`, `nationalfinance`, `verification-site-xj7p`) tournaient 24h/24 → ~2200h/mois nécessaires à eux trois → suspension récurrente avant la fin de chaque mois.

**Pourquoi Oracle Cloud a été abandonné** : leur vérification anti-fraude à la création de compte rejette systématiquement les cartes prépayées/virtuelles. L'utilisateur n'a pas pu créer de compte.

**Solution retenue : migrer chaque service vers Vercel** (déjà utilisé pour les fronts, aucune carte à re-vérifier, pas de compteur d'heures — Vercel facture à l'exécution/bande passante, très généreux en Hobby gratuit).

### Comment l'API Express a été adaptée pour Vercel (référence pour les 2 autres projets)

1. `apps/api/src/app.ts` : la création de l'app Express (routes, middlewares), **sans** `app.listen()`, exportée en named export `app`.
2. `apps/api/src/index.ts` : entrée locale/dev uniquement — importe `app` et appelle `app.listen()`.
3. `apps/api/api/index.ts` : point d'entrée serverless Vercel — `import { app } from '../src/app'; export default app;`. Une app Express est directement utilisable comme handler Vercel (signature `(req, res)` compatible).
4. `apps/api/vercel.json` :
   ```json
   {
     "functions": { "api/index.ts": { "maxDuration": 30 } },
     "rewrites": [
       { "source": "/", "destination": "/api/index" },
       { "source": "/(.*)", "destination": "/api/index" }
     ]
   }
   ```
   - Le bloc `functions` est **obligatoire** : sans lui, Vercel détecte aussi `src/app.ts` comme une fonction candidate (car importé) et plante toutes les requêtes avec `Invalid export found in module`.
   - `functions.<path>` ne peut pas être un objet vide `{}` (schéma Vercel récent) → mettre au moins une propriété (`maxDuration` ici).
   - Ajouter `package.json#scripts.vercel-build: "prisma generate"` (Vercel l'exécute automatiquement s'il existe).
5. **Connu et non résolu** : le chemin racine `/` seul renvoie `FUNCTION_INVOCATION_FAILED` sur Vercel malgré la règle de rewrite dédiée, alors que `/health` et toutes les routes `/api/*` fonctionnent parfaitement. Cause exacte non identifiée (testé : pas un problème de cache CDN, `x-vercel-cache: MISS` à chaque fois). **Non bloquant** — l'app web n'appelle jamais `/`, seul un futur monitoring UptimeRobot sur Vercel en pâtirait ; pointer un éventuel monitor sur `/health` à la place.
6. Config sur le dashboard Vercel (projet séparé, Root Directory = `apps/api`) : copier les env vars depuis l'ancien service Render (`DATABASE_URL`, `JWT_SECRET`, `WEB_ORIGIN`, `GEMINI_API_KEY`, `ADMIN_EMAILS`).
7. Sur le projet **the-harkerhood-web**, mettre à jour `VITE_API_URL` = URL de la nouvelle API Vercel, puis redéployer (Vite bake les env vars au build, un simple changement de variable ne suffit pas).

Testé bout en bout en prod (inscription, token, `/api/dashboard/stats`) — fonctionne intégralement.

## ✅ TERMINÉ : NationalFinance et VériCode migrés (SQLite → Postgres + Vercel)

Les 3 services Render sont maintenant tous sur Vercel + Neon Postgres. Migration complète le 2026-07-20.

- `nationalfinance` (repo `banque-en-ligne`, local `/home/jordan/Documents/nationalfinance`) et `verification-site` / VériCode (repo `verification-site`, local `/home/jordan/Documents/verification-site`) utilisaient **better-sqlite3** avec un fichier `.db` local — incompatible avec le filesystem non persistant de Vercel (et déjà silencieusement à risque sur Render free, dont le filesystem est éphémère à chaque redeploy).
- Conversion appliquée aux deux : `database.js` réécrit avec `pg.Pool` (schéma + seed via `initDb()`), `server.js` converti en async/await avec des helpers `one/all/run` qui auto-convertissent les `?` façon SQLite en `$1,$2…` façon Postgres (`toPg()`), `lastInsertRowid` remplacé par `RETURNING id`, codes d'erreur SQLite (`SQLITE_CONSTRAINT_UNIQUE`) remplacés par les codes Postgres (`23505`), `DATE('now')` remplacé par `::date`/`CURRENT_DATE`.
- Même pattern Vercel que Hackerhood mais en JS (pas TS) : `api/index.js` (`module.exports = require('../server')`), `vercel.json` avec seulement `{ "source": "/api/(.*)", "destination": "/api/index" }` (pas de catch-all — laisser Vercel servir les fichiers statiques directement depuis `public/`, où les `.html` ont été déplacés).
- **2 bugs de robustesse découverts et corrigés dans les deux projets** :
  1. Si l'init du schéma (`initDb()`) échouait une seule fois (blip réseau), la promesse était mise en cache indéfiniment → toutes les requêtes suivantes échouaient en boucle jusqu'au redémarrage du process. Fix : reset de la promesse en cas d'échec pour permettre un retry à la requête suivante.
  2. Endpoint stats de VériCode : 13 requêtes Postgres lancées en `Promise.all` → fusionnées en une seule requête avec `COUNT(*) FILTER (WHERE ...)`, plus robuste et plus rapide.
  3. Ajout d'une résolution DNS forcée en IPv4 uniquement (option `lookup` de `pg`) — contourne un souci de résolution AAAA qui traînait/échouait sur cette machine de dev (aucun impact en prod, où IPv6 fonctionne normalement).
- URLs de prod : NationalFinance → https://nationalfinance.vercel.app (ou `banque-en-ligne-brown.vercel.app`), VériCode → https://vericode-bice.vercel.app.
- Testé bout en bout en prod pour les deux : pages statiques, soumission/suivi (VériCode), login/stats admin, CRUD complet, recherche/filtres.
- `render.yaml` laissé en place dans les deux repos (fichier mort, inoffensif, pas nettoyé).

## Reste à faire (mineur, non bloquant)

- Mettre à jour les moniteurs UptimeRobot vers les nouvelles URLs Vercel (ils pointent encore vers les anciennes URLs Render suspendues).
- Chemin racine `/` de l'API Hackerhood sur Vercel (`the-harkerhood-api-two.vercel.app/`) renvoie toujours `FUNCTION_INVOCATION_FAILED` malgré plusieurs tentatives de fix — non bloquant, `/health` et toutes les routes `/api/*` fonctionnent normalement, l'app web n'appelle jamais `/`.

## Pour reprendre ce projet dans une nouvelle session

Donner ce fichier à lire, puis `git log --oneline -10` dans chacun des 3 repos pour l'historique récent. Plus aucune tâche majeure en attente sur l'infrastructure — la suite dépendra des demandes du fondateur.
