Le web est la surface d'attaque la plus commune en pentest. Avant d'attaquer une application, il faut comprendre comment elle fonctionne : requêtes/réponses HTTP, où vivent les données, et la différence entre ce qui tourne côté client et côté serveur.

## Objectifs

- Décomposer une requête et une réponse HTTP
- Comprendre le rôle du client (navigateur), du serveur, et de la base de données
- Repérer les points d'entrée d'une application web (formulaires, paramètres URL, cookies, headers)

## Le cycle requête/réponse HTTP

Quand tu tapes une URL, ton navigateur envoie une **requête** au serveur, qui renvoie une **réponse**.

```
GET /produits?id=42 HTTP/1.1
Host: boutique.example.com
Cookie: session=abc123
User-Agent: Mozilla/5.0...

HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: session=abc123; HttpOnly

<html>...</html>
```

Les méthodes HTTP les plus courantes : **GET** (récupérer une ressource, paramètres visibles dans l'URL), **POST** (envoyer des données, souvent un formulaire, paramètres dans le corps de la requête), **PUT/DELETE** (modifier/supprimer, typiques des API REST).

Les codes de statut à connaître :

- **2xx** : succès (200 OK, 201 Created)
- **3xx** : redirection (301, 302)
- **4xx** : erreur côté client (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found)
- **5xx** : erreur côté serveur (500 Internal Server Error — souvent révélateur d'un bug exploitable)

Un 500 inattendu quand tu modifies un paramètre est souvent le premier signal qu'une entrée n'est pas correctement validée — le point de départ de beaucoup de vulnérabilités.

## Client, serveur, base de données

- **Le client** (navigateur) exécute le HTML/CSS/JavaScript. Tout ce qui tourne côté client est visible et modifiable par l'utilisateur — ne jamais faire confiance à une validation uniquement côté client.
- **Le serveur** reçoit les requêtes, exécute la logique métier (souvent en PHP, Node.js, Python...), et doit revalider chaque entrée reçue.
- **La base de données** stocke les données persistantes. La communication serveur → base de données via des requêtes SQL mal construites est la source de l'injection SQL (vu en détail dans le cours "Web Pentest — Injection").

## Cookies et sessions

HTTP est **sans état** (chaque requête est indépendante) : le mécanisme de session (souvent un cookie) permet au serveur de reconnaître un utilisateur entre deux requêtes. Le cookie `session=abc123` est envoyé automatiquement par le navigateur à chaque requête vers ce domaine — c'est ce jeton qui prouve "je suis connecté", et c'est pour ça qu'un vol de cookie (XSS, sniffing réseau non chiffré) équivaut à un vol de session.

Les attributs de sécurité d'un cookie à repérer :

- `HttpOnly` : le cookie n'est pas accessible en JavaScript (limite l'impact d'un XSS)
- `Secure` : envoyé uniquement en HTTPS
- `SameSite` : limite l'envoi du cookie lors de requêtes cross-site (protection CSRF)

## Points d'entrée à cartographier

Toute application web expose des points où l'utilisateur influence ce qui se passe côté serveur — c'est précisément ce que tu vas chercher en pentest :

- Paramètres d'URL (`?id=42`)
- Champs de formulaire (login, recherche, upload...)
- Headers HTTP (`User-Agent`, `Referer`, `X-Forwarded-For` — souvent oubliés lors de la validation)
- Cookies

## Pièges fréquents

- Se limiter à ce qui est visible dans l'interface : les paramètres cachés (champs `hidden`, headers custom) sont tout aussi manipulables.
- Confondre "le champ est validé en JavaScript" avec "le champ est sécurisé" — la validation côté client est un confort UX, pas une protection.
- Ignorer les réponses d'erreur détaillées (stack traces, messages SQL) qui fuitent souvent des informations sur la stack technique.

## Pour le lab

**OWASP Juice Shop** est une application volontairement vulnérable qui couvre tous ces concepts en pratique ; **PortSwigger Web Academy — Basics** t'apprend à utiliser Burp Suite (vu plus loin dans la roadmap) pour intercepter et modifier ces requêtes HTTP en direct.
