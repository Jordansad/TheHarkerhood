La privilege escalation Windows suit une logique similaire à Linux (chercher les mauvaises configurations avant les exploits), mais avec un écosystème différent : services, registre, privilèges de jetons (tokens). Ce cours couvre les vecteurs les plus fréquents sur un poste Windows standalone ou membre d'un domaine.

## Objectifs

- Utiliser les commandes d'énumération Windows de base (whoami, systeminfo, services)
- Comprendre l'exploitation d'un service mal configuré (chemin non-quoté, permissions)
- Reconnaître les privilèges de jeton dangereux (SeImpersonate...)

## Énumération de base

```
whoami /priv                    # privilèges du jeton actuel — la commande la plus importante
whoami /groups                  # groupes d'appartenance
systeminfo                      # version exacte de l'OS, patchs installés
net user                        # comptes locaux
tasklist /svc                   # processus et services associés
wmic service list brief         # liste des services installés
```

`whoami /priv` est l'équivalent du `sudo -l` Linux : il révèle immédiatement si le compte actuel dispose de privilèges spéciaux exploitables, sans attendre d'avoir énuméré quoi que ce soit d'autre.

Comme sous Linux, des scripts automatisent cette énumération : **WinPEAS** est l'équivalent direct de LinPEAS, et met en évidence les pistes prometteuses en couleur.

## Vecteur 1 : chemins de service non quotés

Quand le chemin d'exécution d'un service Windows contient un espace et n'est pas entouré de guillemets, Windows tente d'interpréter chaque segment séparé par un espace comme un exécutable potentiel :

```
C:\Program Files\Mon Service\service.exe
```

Sans guillemets, Windows essaie dans l'ordre : `C:\Program.exe`, puis `C:\Program Files\Mon.exe`, avant d'arriver au bon chemin. Si un attaquant peut écrire un fichier `Program.exe` à la racine de `C:\` (droits d'écriture souvent mal restreints), et que ce service tourne avec des privilèges élevés (SYSTEM), redémarrer le service exécute le fichier malveillant avec ces privilèges.

```
wmic service get name,pathname,startmode | findstr /i /v "C:\Windows"
```

Cette commande liste les services dont le chemin ne commence pas par `C:\Windows` (donc plus susceptibles d'être des installations tierces mal configurées) — un bon point de départ pour chercher ce vecteur.

## Vecteur 2 : permissions de service

Même sans chemin non-quoté, si un utilisateur a le droit de **modifier la configuration** d'un service (pas seulement de le démarrer/arrêter), il peut simplement changer le binaire exécuté par un service qui tourne en SYSTEM :

```
sc qc NomDuService              # voir la configuration actuelle
sc config NomDuService binpath= "C:\chemin\vers\malicious.exe"
sc start NomDuService
```

L'outil **accesschk** (Sysinternals) permet de vérifier précisément quels services un utilisateur donné peut modifier — l'énumération manuelle exhaustive de tous les services est peu pratique sans cet outil.

## Vecteur 3 : privilèges de jeton dangereux

Windows attribue des **privilèges** (tokens) à chaque session, indépendamment du groupe d'appartenance. Certains sont extrêmement dangereux s'ils sont accordés à un compte non-administrateur :

- **SeImpersonatePrivilege** : permet d'usurper le jeton d'un autre processus. Combiné à des techniques comme **PrintSpoofer** ou **JuicyPotato**, ce privilège seul suffit très souvent à obtenir SYSTEM depuis un compte de service quelconque — l'un des vecteurs de privesc Windows les plus fréquents en pratique.
- **SeBackupPrivilege** : permet de lire n'importe quel fichier, y compris ceux normalement protégés (comme la base SAM contenant les hash de mots de passe locaux).
- **SeDebugPrivilege** : permet de déboguer/manipuler n'importe quel processus, y compris ceux tournant en SYSTEM.

`whoami /priv` affiche l'état "Enabled" ou "Disabled" pour chaque privilège présent — un privilège présent mais désactivé peut souvent être réactivé.

## Vecteur 4 : mots de passe qui traînent

Comme sous Linux, chercher des identifiants oubliés reste rentable : fichiers de configuration, scripts PowerShell avec des mots de passe en clair, historique PowerShell (`Get-History`), le registre (`reg query HKLM\SOFTWARE\...` pour des logiciels qui stockent des credentials en clair), ou les identifiants sauvegardés Windows (`cmdkey /list`).

## Pièges fréquents

- Ignorer `whoami /priv` en tout début d'énumération — c'est souvent la vérification la plus rapide et la plus rentable, exactement comme `sudo -l` sous Linux.
- Négliger SeImpersonatePrivilege parce qu'il ne "ressemble" pas à un privilège administrateur — c'est pourtant l'un des chemins les plus directs vers SYSTEM.
- Oublier de vérifier les chemins de service non quotés avec espaces, une négligence de configuration encore très répandue en environnement réel.

## Pour le lab

Le module **Windows Privilege Escalation** de TryHackMe/HTB fait pratiquer chacun de ces vecteurs sur des machines Windows dédiées, avec WinPEAS comme point de départ recommandé pour repérer rapidement la piste la plus prometteuse.
