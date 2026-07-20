De plus en plus d'infrastructures tournent dans le cloud (AWS, Azure, GCP), avec un modèle de sécurité fondamentalement différent d'un serveur traditionnel. Une mauvaise configuration cloud — pas une faille logicielle — est aujourd'hui la cause numéro un des fuites de données massives.

## Objectifs

- Comprendre le modèle de responsabilité partagée
- Identifier les erreurs de configuration cloud les plus fréquentes (buckets, IAM)
- Connaître les bases de la sécurité IAM (principe du moindre privilège)

## Le modèle de responsabilité partagée

Dans le cloud, la sécurité se répartit entre le fournisseur et le client — et l'erreur la plus fréquente est de mal comprendre cette frontière :

- **Le fournisseur** (AWS, Azure, GCP) sécurise l'infrastructure physique, le réseau global, le matériel — "la sécurité **du** cloud".
- **Le client** sécurise sa configuration : qui a accès à quoi, comment les données sont stockées, quels ports sont ouverts — "la sécurité **dans** le cloud".

Cette répartition change selon le type de service : sur de l'IaaS (machines virtuelles brutes), le client gère presque tout au-dessus de l'infrastructure ; sur du SaaS, le fournisseur gère beaucoup plus. Mais dans tous les cas, la **configuration des accès reste toujours la responsabilité du client** — et c'est précisément là que se produisent la majorité des incidents.

## Buckets de stockage mal configurés

Un bucket S3 (AWS) ou équivalent (Azure Blob, GCS) mal configuré en accès public est l'une des causes de fuite de données les plus documentées de la dernière décennie — des millions d'enregistrements exposés simplement parce qu'un bucket destiné à un usage interne était accessible publiquement sur Internet.

```bash
# Reconnaissance basique : tester si un bucket S3 est accessible publiquement
aws s3 ls s3://nom-du-bucket --no-sign-request

# Outils dédiés à l'énumération de buckets mal configurés (à utiliser uniquement
# dans un cadre de test autorisé) : S3Scanner, GrayhatWarfare
```

Le réflexe défensif : bloquer l'accès public par défaut au niveau du compte entier (AWS propose un réglage "Block Public Access" appliqué globalement), et n'ouvrir explicitement que ce qui doit vraiment être public.

## IAM : Identity and Access Management

IAM contrôle **qui** peut faire **quoi** sur les ressources cloud. Le principe fondamental : **le moindre privilège** — chaque identité (utilisateur, application, service) ne doit avoir que les permissions strictement nécessaires à sa fonction, jamais plus "par sécurité" ou par facilité.

Erreurs IAM courantes en pratique :

- Des politiques trop larges (`"Action": "*"`, `"Resource": "*"`) accordées par commodité et jamais restreintes ensuite
- Des clés d'accès (access keys) codées en dur dans du code applicatif, souvent committées par erreur dans un dépôt Git public (voir cours Git & Documentation)
- Des rôles avec des permissions d'administration accordés à des services qui n'en ont besoin que ponctuellement

## Métadonnées d'instance et SSRF

Les machines virtuelles cloud exposent un service de métadonnées interne (souvent à l'adresse `169.254.169.254`) qui peut fournir des credentials temporaires attachés à l'instance. Si une application web sur cette instance est vulnérable à une **SSRF** (Server-Side Request Forgery — la requête part du serveur, pas du navigateur), un attaquant peut forcer le serveur à interroger cette adresse de métadonnées et récupérer ces credentials, souvent avec des permissions bien plus larges que prévu par l'application elle-même.

```
GET /metadata/v1/  (exemple générique)
Host: 169.254.169.254
```

C'est un des exemples les plus concrets de la façon dont une vulnérabilité web "classique" (SSRF) prend une dimension bien plus grave dans un environnement cloud.

## Sécurité réseau cloud

Les **security groups** (AWS) ou **network security groups** (Azure) sont des firewalls virtuels attachés aux ressources. Erreur fréquente : des règles trop permissives (ouvrir un port de base de données à `0.0.0.0/0`, soit tout Internet, au lieu de le restreindre au réseau interne uniquement) — l'équivalent cloud d'un service exposé sans protection.

## Pièges fréquents

- Croire que "c'est dans le cloud" signifie "c'est sécurisé par défaut" — la sécurité de la configuration reste entièrement la responsabilité du client.
- Accorder des permissions larges "temporairement" pour débloquer un développement, et ne jamais les restreindre après coup.
- Committer des clés d'API cloud dans un dépôt de code — vérifier systématiquement les scanners de secrets (GitHub secret scanning, gitleaks) avant de pousser du code.

## Pour le lab

Des plateformes comme **flAWS** (challenge dédié à la sécurité AWS) et les modules cloud de TryHackMe font pratiquer l'identification de buckets mal configurés, l'exploitation de SSRF vers les métadonnées, et l'analyse de politiques IAM trop permissives — exactement les scénarios décrits ci-dessus.
