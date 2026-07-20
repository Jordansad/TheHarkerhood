Après plusieurs modules côté attaque, ce cours change de perspective : comment un Security Operations Center (SOC) détecte et répond aux attaques que tu viens d'apprendre à mener. Comprendre la défense rend aussi meilleur en attaque — savoir ce qui déclenche une alerte permet de mieux comprendre le risque réel d'une action.

## Objectifs

- Comprendre le rôle d'un SOC et le cycle de détection/réponse
- Savoir lire les logs Windows/Linux essentiels à la détection d'intrusion
- Connaître les bases d'un SIEM et la notion d'alerte

## Le rôle d'un SOC

Un SOC surveille en continu l'infrastructure d'une organisation pour détecter des activités suspectes, les analyser, et y répondre. L'équipe s'organise typiquement en niveaux :

- **Analyste niveau 1** : trie les alertes générées automatiquement, écarte les faux positifs évidents, escalade ce qui semble réel.
- **Analyste niveau 2/3** : investigation approfondie, analyse forensique, réponse à incident.
- **Threat hunter** : recherche proactive de menaces qui n'ont déclenché aucune alerte automatique.

Le cycle typique : **Détection** (une alerte se déclenche) → **Triage** (est-ce un vrai positif ?) → **Investigation** (quelle est l'étendue ?) → **Confinement** (isoler la menace) → **Éradication et remédiation**.

## Logs essentiels côté Windows

Les **Windows Event Logs** sont la source principale de détection sur un poste ou serveur Windows, consultables via l'Observateur d'événements ou PowerShell (`Get-WinEvent`). Quelques Event IDs à connaître absolument :

- **4624** : connexion réussie (à corréler avec le type de connexion — un 4624 de type 3 en pleine nuit depuis une IP inconnue est suspect)
- **4625** : échec de connexion — plusieurs 4625 rapprochés suggèrent un brute-force
- **4688** : création de processus — utile pour repérer l'exécution d'outils offensifs
- **4720** : création d'un compte utilisateur — un signal fort de persistance si non planifié

Ces mêmes Event IDs sont exactement ce qu'un attaquant cherche à minimiser ou effacer pour rester discret — comprendre ce que chaque action offensive génère comme trace est directement utile des deux côtés.

## Logs essentiels côté Linux

- `/var/log/auth.log` (Debian/Ubuntu) ou `/var/log/secure` (RHEL/CentOS) : authentifications, tentatives sudo, connexions SSH
- `/var/log/syslog` : journal système général
- Historique bash (`~/.bash_history`) : souvent riche en informations, mais facilement effacé ou désactivé par un attaquant averti

```bash
grep "Failed password" /var/log/auth.log | tail -20   # tentatives de connexion SSH échouées
grep "sudo" /var/log/auth.log                          # commandes sudo exécutées
```

## Qu'est-ce qu'un SIEM

Un **SIEM** (Security Information and Event Management) centralise les logs de toute l'infrastructure (postes, serveurs, firewalls, applications) dans un seul système, applique des règles de corrélation, et génère des alertes. Exemples : Splunk, Elastic Security, Microsoft Sentinel.

Une **règle de détection** typique : "plus de 5 échecs de connexion sur le même compte en moins de 2 minutes" déclenche une alerte de brute-force potentiel. La qualité d'un SOC dépend largement de la pertinence de ses règles — trop sensibles, elles noient les analystes sous les faux positifs ; trop larges, elles laissent passer de vraies attaques (faux négatifs).

## Faux positifs et faux négatifs

- **Faux positif** : une alerte se déclenche pour une activité légitime (un admin qui se connecte depuis un nouveau poste). Trop de faux positifs épuisent l'attention des analystes ("alert fatigue"), un vrai problème opérationnel dans beaucoup de SOC.
- **Faux négatif** : une attaque réelle ne déclenche aucune alerte — le scénario le plus dangereux, souvent dû à des règles de détection insuffisantes ou à une technique d'évasion efficace côté attaquant.

## Indicateurs de compromission (IOC)

Un IOC est un élément observable qui signale une compromission potentielle : une adresse IP connue comme malveillante, un hash de fichier correspondant à un malware connu, un nom de processus inhabituel, une clé de registre de persistance. Les plateformes de threat intelligence partagent des listes d'IOC à surveiller — approfondi dans le cours Forensics & Incident Response qui suit.

## Pièges fréquents

- Sous-estimer l'importance de la corrélation temporelle : un seul événement isolé (un échec de connexion) est rarement significatif, c'est le pattern dans le temps qui compte.
- Considérer la détection comme purement automatique — l'analyse humaine du contexte (ce compte a-t-il une raison légitime de se connecter à cette heure ?) reste indispensable.
- Ignorer les logs applicatifs au profit des seuls logs système — beaucoup d'attaques web ne laissent de trace que dans les logs du serveur applicatif.

## Pour le lab

**BlueTeamLabs Online** propose des investigations guidées à partir de vrais jeux de logs, où il faut identifier une intrusion à partir des Event IDs et patterns décrits ci-dessus — la meilleure façon de développer le réflexe d'analyste SOC.
