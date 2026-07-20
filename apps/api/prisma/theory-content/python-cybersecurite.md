Bash suffit pour enchaîner des commandes ; Python devient indispensable dès que tu veux traiter des données structurées, parler à une API, ou construire un outil plus complexe (scanner, brute-forcer, parseur). C'est le langage numéro un en sécurité offensive.

## Objectifs

- Écrire un script Python avec les structures de base (variables, boucles, fonctions)
- Lire/écrire des fichiers et manipuler des chaînes de caractères
- Faire une requête réseau simple avec `socket` ou `requests`

## Bases rapides

```python
target = "10.10.10.5"
ports = [21, 22, 80, 443]

def format_result(port, status):
    return f"Port {port}: {status}"

for port in ports:
    print(format_result(port, "à tester"))
```

Les f-strings (`f"texte {variable}"`) sont la façon moderne de construire des chaînes avec des variables intégrées — à utiliser systématiquement plutôt que la concaténation avec `+`.

Structures de contrôle :

```python
if len(ports) == 0:
    print("Aucun port à scanner")
elif len(ports) > 100:
    print("Beaucoup de ports")
else:
    print(f"{len(ports)} ports à tester")

# Listes et dictionnaires : les deux structures que tu utiliseras le plus
found_ports = []
services = {21: "FTP", 22: "SSH", 80: "HTTP"}

for port, service in services.items():
    print(f"{port} -> {service}")
```

## Fichiers et manipulation de texte

```python
with open("targets.txt") as f:
    targets = [line.strip() for line in f]  # une liste de compréhension : lit chaque ligne, enlève les \n

with open("results.txt", "w") as f:
    for t in targets:
        f.write(f"{t}\n")
```

Le `with open(...) as f` ferme automatiquement le fichier à la fin du bloc — toujours l'utiliser plutôt que `open()`/`close()` manuel, qui oublie facilement de fermer le fichier en cas d'erreur.

Manipulation de chaînes fréquente en parsing de résultats d'outils :

```python
line = "22/tcp open ssh"
parts = line.split()          # découpe sur les espaces -> ['22/tcp', 'open', 'ssh']
port = parts[0].split("/")[0]  # '22'
print(int(port))               # conversion en entier : 22
```

## Un socket réseau basique

`socket` est le module bas niveau pour parler directement au réseau — c'est ce qui se cache derrière un scanner de ports fait maison :

```python
import socket

def check_port(host, port, timeout=1):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    result = sock.connect_ex((host, port))  # renvoie 0 si le port est ouvert
    sock.close()
    return result == 0

for port in [22, 80, 443, 8080]:
    if check_port("10.10.10.5", port):
        print(f"Port {port} ouvert")
```

`connect_ex` renvoie un code d'erreur au lieu de lever une exception — plus pratique pour un scan en boucle où beaucoup de ports seront fermés.

## Requêtes HTTP avec `requests`

Pour parler à une application web (API, formulaire...), la librairie `requests` (à installer via `pip install requests`) simplifie énormément le travail :

```python
import requests

r = requests.get("http://10.10.10.5", timeout=5)
print(r.status_code)          # 200, 404, 403...
print(r.headers.get("Server"))  # souvent révèle la techno derrière le site

r2 = requests.post("http://10.10.10.5/login", data={"user": "admin", "pass": "test"})
```

C'est le point de départ de tout script qui automatise du test d'API, de la recherche de contenu caché, ou du brute-force de formulaire (à ne faire que sur des cibles autorisées, en lab).

## Pièges fréquents

- Oublier les indentations cohérentes — Python est strict là-dessus, contrairement à Bash.
- Ne pas mettre de `timeout` sur les connexions réseau : un script qui scanne peut rester bloqué indéfiniment sur un hôte qui ne répond pas.
- Modifier une liste pendant qu'on la parcourt avec une boucle `for` — comportement imprévisible, préférer construire une nouvelle liste.

## Pour le lab

Les exercices Python personnalisés de cette étape te font écrire un mini scanner de ports et un parseur de fichier — directement les deux blocs de code (`socket` et manipulation de fichiers) vus ci-dessus, à assembler toi-même.
