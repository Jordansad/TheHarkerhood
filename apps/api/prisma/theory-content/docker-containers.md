Docker et les conteneurs sont omniprésents dans les infrastructures modernes — comprendre leur fonctionnement est nécessaire à la fois pour les attaquer (échapper à un conteneur) et pour les défendre. Contrairement à une idée reçue, un conteneur n'est **pas** une machine virtuelle isolée de façon aussi stricte.

## Objectifs

- Comprendre la différence entre conteneur et machine virtuelle
- Reconnaître une configuration Docker dangereuse (mode privileged, socket exposé)
- Savoir échapper à un conteneur mal configuré vers l'hôte

## Conteneur vs machine virtuelle

Une **machine virtuelle** virtualise du matériel complet, avec son propre noyau — isolation forte, mais lourde en ressources. Un **conteneur** partage le noyau de la machine hôte et isole uniquement les processus, le système de fichiers, et le réseau via des mécanismes du noyau Linux (namespaces, cgroups) — beaucoup plus léger, mais l'isolation est fondamentalement plus fine, et donc potentiellement plus fragile si mal configurée.

```
VM :        Hôte → Hyperviseur → [Noyau invité + Apps] × plusieurs VMs
Conteneur : Hôte → Noyau partagé → [Apps isolées] × plusieurs conteneurs
```

Cette différence est la raison pour laquelle une mauvaise configuration Docker peut donner un accès direct au système hôte, alors qu'échapper à une VM correctement configurée est une catégorie de vulnérabilité bien plus rare et complexe.

## Le mode privileged : le danger numéro un

Lancer un conteneur avec `--privileged` désactive la quasi-totalité des restrictions de sécurité normalement appliquées : le conteneur a alors accès à tous les périphériques de l'hôte, peut charger des modules noyau, et peut effectivement obtenir un accès équivalent à root sur la machine hôte elle-même.

```bash
# Dangereux : donne un accès quasi total à l'hôte
docker run --privileged -v /:/mnt -it ubuntu chroot /mnt bash
```

Cette commande illustre le principe : monter le système de fichiers racine de l'hôte (`-v /:/mnt`) à l'intérieur d'un conteneur privilégié, puis `chroot` dedans, donne un shell avec les droits root **sur l'hôte**, pas seulement sur le conteneur. C'est exactement le mécanisme évoqué dans le cours de privilege escalation Linux à propos du groupe `docker`.

## Le socket Docker exposé

Le socket Docker (`/var/run/docker.sock`) permet de contrôler le démon Docker — créer, lancer, arrêter des conteneurs. Si ce socket est monté à l'intérieur d'un conteneur (pratique courante pour des outils de CI/CD ou de monitoring), n'importe quel processus dans ce conteneur peut l'utiliser pour lancer un **nouveau** conteneur privilégié montant le disque de l'hôte — un chemin d'escalade équivalent au mode `--privileged` direct.

```bash
# Si /var/run/docker.sock est accessible depuis l'intérieur d'un conteneur :
docker -H unix:///var/run/docker.sock run -v /:/mnt --privileged -it ubuntu chroot /mnt bash
```

Le réflexe défensif : ne jamais monter le socket Docker dans un conteneur sauf nécessité absolue, et dans ce cas, restreindre strictement ce que ce conteneur peut faire.

## Images non vérifiées

Une image Docker tirée d'un registre public (`docker pull une-image-inconnue`) exécute un système de fichiers complet dont le contenu n'est pas garanti — une image malveillante peut embarquer un malware, un mineur de cryptomonnaie, ou une backdoor. Vérifier la provenance (image officielle, éditeur vérifié) et scanner les images avant déploiement (outils comme Trivy) sont des pratiques de base en environnement de production.

## Bonnes pratiques de configuration

- **Ne jamais lancer en `--privileged`** sauf besoin technique explicite et justifié
- **Principe du moindre privilège** : utilisateur non-root à l'intérieur du conteneur (directive `USER` dans le Dockerfile), capacités Linux limitées au strict nécessaire (`--cap-drop=ALL` puis n'ajouter que ce qui est requis)
- **Limiter les ressources** (CPU, mémoire) pour éviter qu'un conteneur compromis n'épuise les ressources de l'hôte
- **Réseaux isolés** : ne pas exposer inutilement des ports, séparer les conteneurs par fonction via des réseaux Docker dédiés

## Pièges fréquents

- Confondre l'isolation d'un conteneur avec celle d'une VM — un conteneur mal configuré offre des chemins d'évasion bien plus directs.
- Monter le socket Docker par facilité dans un pipeline CI/CD sans mesurer le risque que ça représente pour tout ce qui tourne à côté.
- Faire confiance à une image publique sans en vérifier la provenance ni la scanner.

## Pour le lab

Les labs dédiés à l'évasion de conteneur (disponibles sur TryHackMe et HTB) reproduisent précisément les scénarios `--privileged` et socket Docker exposé décrits ci-dessus, avec pour objectif d'obtenir un accès à l'hôte depuis un conteneur intentionnellement mal configuré.
