Burp Suite est l'outil central de tout pentest web : un proxy qui s'intercale entre ton navigateur et l'application cible, te permettant de voir et modifier chaque requête avant qu'elle ne parte. C'est ce qui transforme la théorie du cours précédent en manipulations concrètes.

## Objectifs

- Configurer le proxy Burp et intercepter du trafic HTTP/HTTPS
- Utiliser Repeater pour rejouer et modifier des requêtes
- Utiliser Intruder pour automatiser des tests sur un paramètre

## Configuration du proxy

Burp fonctionne comme un proxy local (par défaut `127.0.0.1:8080`) : le navigateur envoie ses requêtes à Burp, qui les transmet ensuite au serveur réel. Deux étapes de configuration :

1. Régler le navigateur (ou utiliser le navigateur intégré de Burp) pour passer par le proxy `127.0.0.1:8080`.
2. Installer le certificat CA de Burp dans le navigateur — indispensable pour intercepter le trafic **HTTPS**, puisque Burp doit déchiffrer/rechiffrer la connexion (un "man-in-the-middle" volontaire et local).

Une fois configuré, l'onglet **Proxy > Intercept** montre chaque requête en attente, avec un bouton "Forward" pour la laisser passer ou "Drop" pour l'annuler.

## Les modules essentiels

**Proxy** capture tout le trafic qui transite ; l'onglet **HTTP history** garde un historique consultable de toutes les requêtes/réponses, même après avoir désactivé l'interception active.

**Repeater** prend une requête capturée et permet de la modifier et de la renvoyer autant de fois que nécessaire, en observant la réponse à chaque fois. C'est l'outil principal pour tester manuellement une injection : modifier un paramètre, envoyer, lire la réponse, ajuster, recommencer.

```
Clic droit sur une requête dans l'historique → "Send to Repeater"
Modifier le paramètre suspect directement dans la requête
Cliquer "Send" et observer la réponse
```

**Intruder** automatise l'envoi d'une requête avec des valeurs variables à un endroit précis (marqué par `§valeur§`) — utile pour du brute-force de paramètre, tester une liste de payloads d'injection, ou énumérer des identifiants valides.

```
Position : /login?user=§admin§&pass=test
Payload : liste de noms d'utilisateurs à tester
Type d'attaque "Sniper" : teste chaque valeur de la liste, une position à la fois
```

Les résultats s'affichent avec le code de statut et la taille de réponse pour chaque tentative — une taille de réponse différente parmi une liste homogène est souvent le signal d'un résultat different (ex : nom d'utilisateur valide vs invalide).

**Decoder** encode/décode rapidement en Base64, URL-encoding, hex... utile pour comprendre un paramètre ou un cookie encodé, ou préparer un payload correctement formaté.

## Une session de test typique

1. Naviguer normalement sur l'application avec Burp en interception passive — construire l'historique complet des endpoints.
2. Repérer les points d'entrée intéressants (formulaires, paramètres d'ID, uploads).
3. Envoyer les requêtes suspectes vers Repeater pour tester manuellement (injection, contournement de contrôle d'accès en changeant un ID...).
4. Utiliser Intruder pour ce qui nécessite du volume (brute-force, fuzzing de paramètres).

## Pièges fréquents

- Oublier d'installer le certificat CA de Burp : le trafic HTTPS n'est alors pas intercepté, ou le navigateur affiche des erreurs de certificat en boucle.
- Laisser l'interception active en permanence : chaque requête se bloque en attendant un clic "Forward", ce qui rend la navigation normale insupportable — désactiver l'interception dès que ce n'est plus nécessaire et se fier à l'historique.
- Ne pas sauvegarder le projet Burp : toute la session (historique, requêtes Repeater) est perdue à la fermeture sans sauvegarde explicite.

## Pour le lab

Les labs **PortSwigger** intègrent directement Burp dans leur méthodologie recommandée : chaque lab d'injection ou de contrôle d'accès vu précédemment se résout typiquement en interceptant une requête, en l'envoyant vers Repeater, puis en itérant sur les modifications jusqu'à obtenir le comportement recherché.
