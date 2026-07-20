Les applications modernes exposent de plus en plus leur logique via des API (REST, GraphQL) consommées par des apps mobiles, des frontends JavaScript, ou d'autres services. La sécurité API a ses propres catégories de vulnérabilités, formalisées par l'OWASP API Security Top 10 — distinctes (bien que liées) du Top 10 web classique.

## Objectifs

- Comprendre les vulnérabilités API les plus critiques : BOLA, excès de données exposées
- Savoir tester une API REST avec des outils adaptés (Postman, Burp)
- Reconnaître les faiblesses spécifiques à l'authentification API (JWT, clés API)

## BOLA : Broken Object Level Authorization

La vulnérabilité API la plus fréquente et la plus critique du OWASP API Top 10. Le principe : une API vérifie qu'un utilisateur est authentifié, mais ne vérifie pas qu'il a le droit d'accéder à **cet objet précis**.

```
GET /api/factures/1234    -> facture de l'utilisateur connecté, OK
GET /api/factures/1235    -> en changeant juste l'ID, facture d'un AUTRE utilisateur ?
```

Si l'API renvoie la facture 1235 sans vérifier qu'elle appartient bien à l'utilisateur qui fait la requête, c'est une BOLA : n'importe quel utilisateur authentifié peut accéder aux données de n'importe quel autre en itérant simplement sur les IDs. C'est l'équivalent API de l'IDOR (Insecure Direct Object Reference) côté web classique, et c'est extrêmement répandu en pratique — de nombreuses fuites de données majeures ont cette cause précise.

Le test systématique : pour chaque endpoint qui prend un identifiant en paramètre, essayer d'accéder à une ressource appartenant à un autre compte (créer deux comptes de test, comparer).

## Excès de données exposées (Excessive Data Exposure)

Une API renvoie parfois plus de données que ce dont le frontend a réellement besoin, en laissant le filtrage à l'application cliente — un attaquant qui interroge directement l'API (en contournant l'interface) voit alors des champs jamais censés être visibles (mots de passe hashés, informations internes, données d'autres utilisateurs partiellement incluses dans une réponse groupée).

```json
// Réponse API réelle, alors que le frontend n'affiche que "name" et "email" :
{
  "id": 42,
  "name": "Alice",
  "email": "alice@example.com",
  "password_hash": "$2b$10$...",
  "internal_notes": "Cliente VIP, négociation en cours"
}
```

Le réflexe de test : ne jamais se fier à ce que montre l'interface graphique, toujours inspecter la réponse brute de l'API (via Burp ou les outils développeur du navigateur).

## Absence de limitation de débit (rate limiting)

Une API sans limitation de débit permet un brute-force massif (sur un endpoint de login, un OTP à 4 chiffres, une énumération d'IDs pour du BOLA à grande échelle) sans aucun frein technique. Un test simple : envoyer un grand nombre de requêtes rapprochées et observer si l'API répond toujours normalement ou finit par bloquer/ralentir (codes 429 Too Many Requests).

## JWT et authentification API

Les **JSON Web Tokens** (JWT) sont un mécanisme d'authentification courant en API : un jeton signé contenant des informations (souvent l'identité de l'utilisateur et son rôle), vérifié à chaque requête sans consulter de base de données.

Faiblesses fréquentes :

- **Algorithme "none"** : certaines implémentations mal codées acceptent un JWT dont l'en-tête déclare l'algorithme `none` — signifiant "pas de signature à vérifier". Un attaquant peut alors forger un jeton avec n'importe quel contenu (ex : `role: admin`) sans avoir besoin de connaître la clé de signature.
- **Secret faible** : si le JWT est signé avec HMAC (HS256) et un secret faible/deviné, il peut être cassé hors ligne puis réutilisé pour forger des jetons valides.
- **Absence de vérification d'expiration** : un jeton volé reste utilisable indéfiniment si l'API ne vérifie pas la date d'expiration (`exp`).

L'outil **jwt_tool** automatise le test de ces faiblesses classiques sur un jeton JWT donné.

## Clés API mal protégées

Une clé API codée en dur dans une application mobile ou un frontend JavaScript est extractible par n'importe qui (décompilation d'APK, simple lecture du code source JavaScript livré au navigateur) — jamais considérer une clé API intégrée côté client comme un secret réellement protégé.

## Pièges fréquents

- Tester uniquement les endpoints documentés/visibles dans l'interface, en ignorant que la documentation Swagger/OpenAPI (souvent accessible publiquement) révèle des endpoints supplémentaires non utilisés par le frontend principal.
- Se fier au filtrage visuel de l'interface plutôt qu'à la réponse API brute réellement renvoyée.
- Négliger de tester le contrôle d'accès sur les méthodes HTTP moins courantes (PUT, DELETE, PATCH) qui suivent parfois une logique d'autorisation différente du GET associé.

## Pour le lab

Les scénarios de type "API testing" sur PortSwigger et les CTF orientés API font pratiquer précisément le test de BOLA (créer deux comptes, comparer les accès), l'inspection de réponses brutes, et l'analyse de jetons JWT avec jwt_tool.
