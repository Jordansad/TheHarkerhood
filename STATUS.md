# The Hackerhood — État du projet

Plateforme communautaire d'apprentissage cybersécurité. Monorepo npm workspaces :
`apps/web` (React/Vite, sur Vercel), `apps/api` (Express/Prisma, sur Render — **suspendu, voir migration**), `packages/types`.

Repo : `git@github.com:Jordansad/TheHarkerhood.git`
Web (Vercel, OK) : https://the-harkerhood-web.vercel.app
API (Render, suspendu) : https://theharkerhood.onrender.com

## État fonctionnel : toutes les phases du plan initial sont livrées

- Roadmap 12 mois, méthodologies + checklists, système de progression Bronze→Legend, journal/wiki, CTF + certifications + annuaire équipe, quiz (+ gestion admin des quiz), Mentor IA (Google Gemini, gratuit), dashboard fondateur (`/admin`), branding (logo en filigrane partout), design animé/futuriste.
- Rôles : `UserRole` founder→member, bootstrap via `ADMIN_EMAILS`.
- DB : Neon Postgres, accès via `@prisma/adapter-pg` (contournement d'un souci IPv6 local, sans rapport avec Render).

## Bugs récents corrigés (tous poussés, commits `116f2eb` → `9b593d2`)

1. Route racine `/` manquante → causait un faux "down" sur UptimeRobot (404 au lieu de 200). Fixé.
2. Navigation mobile : sidebar fixe 240px sans repli → écrasait l'écran sur téléphone. Remplacée par un tiroir + bouton hamburger.
3. Pages bloquées en chargement infini si une requête API échouait (aucun `.catch()` nulle part) → ajout de `useApiGet` + `ErrorState` partout.
4. **Bug racine du "dashboard vide sur mobile"** : cookie de session cross-site (Vercel↔Render, `sameSite=None`) refusé par les navigateurs mobiles (Safari surtout), même en HTTPS. Fix : le login/register renvoient maintenant aussi un `token` dans le corps de la réponse, stocké côté client et envoyé via header `Authorization: Bearer` sur chaque requête (le cookie reste en place en complément). Testé et confirmé en prod sans aucun cookie.

## 🔴 EN COURS : migration hors de Render (suspendu pour dépassement du quota gratuit)

**Cause** : Render offre 750h/mois **partagées entre tous les services gratuits du compte**. Trois services tournaient 24h/24 (`theharkerhood`, `nationalfinance`, `verification-site-xj7p`) → ~2200h/mois nécessaires à eux trois → dépassement et suspension avant la fin de chaque mois. Va se reproduire tant que rien ne change.

**Décision prise avec l'utilisateur** : migrer les 3 services vers un unique VPS **Oracle Cloud "Always Free"** (gratuit à vie, pas de compteur d'heures) plutôt que Railway (crédit $5/mois insuffisant) ou réduire le nombre de services actifs.

**Où ça en est** :
- Clé SSH dédiée déjà générée en local : `~/.ssh/oracle_vps` (publique : `~/.ssh/oracle_vps.pub`).
- L'utilisateur est en train de créer son compte Oracle Cloud et de provisionner l'instance (Ubuntu, `VM.Standard.A1.Flex`, 2 OCPU / 12 GB RAM, la clé SSH ci-dessus ajoutée à la création).
- **Prochaine étape dès que l'utilisateur donne l'IP publique** : se connecter en SSH, installer Docker + Docker Compose + un reverse proxy (Caddy, pour HTTPS automatique), puis déployer les 3 apps :
  - `hackerhood` : `apps/api` (Express/Prisma) — la DB reste sur Neon (externe, pas concernée par la migration), donc pas de volume de données à migrer pour ce service, juste redéployer le conteneur API et pointer `VITE_API_URL` du front Vercel vers la nouvelle URL.
  - `nationalfinance` (repo `banque-en-ligne`, local `/home/jordan/Documents/nationalfinance`) : Express + **better-sqlite3** (fichier `nationalfinance.db` en local sur le filesystem du service) — attention, sur Render free le filesystem est éphémère donc ces données étaient déjà à risque de disparaître à chaque redeploy ; le VPS Oracle règle ça définitivement puisque le disque est persistant. Bien migrer/sauvegarder le `.db` existant si des données réelles doivent être conservées.
  - `verification-site` (repo `verification-site`, local `/home/jordan/Documents/verification-site`) : même stack que nationalfinance (Express + better-sqlite3 + `verification.db`), même remarque sur la persistance.
- Il faudra aussi mettre à jour les moniteurs UptimeRobot vers les nouvelles URLs une fois la migration faite.

## Pour reprendre ce projet dans une nouvelle session

Donner ce fichier à lire, puis `git log --oneline -10` pour l'historique récent. Le prochain point de reprise le plus probable est la migration Oracle décrite ci-dessus.
