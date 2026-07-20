Impossible de comprendre une attaque réseau, un scan Nmap ou une capture Wireshark sans les bases du modèle réseau. Ce cours couvre ce qu'il faut absolument savoir avant d'aller plus loin : adressage, ports, et le trio TCP/UDP/ICMP.

## Objectifs

- Comprendre le modèle en couches (simplifié) et où se situent IP, TCP, HTTP
- Lire une adresse IP et un masque de sous-réseau
- Connaître les ports et protocoles les plus courants

## Le modèle en couches, version pratique

Pas besoin de réciter les 7 couches OSI par cœur — ce qui compte au quotidien, c'est cette version simplifiée :

1. **Couche réseau (IP)** : adressage et routage — comment un paquet trouve son chemin d'une machine à une autre.
2. **Couche transport (TCP/UDP)** : découpage en segments, ports, fiabilité (TCP) ou rapidité (UDP).
3. **Couche application (HTTP, DNS, SSH...)** : le contenu réellement échangé.

Un scan Nmap, par exemple, opère au niveau transport (il teste des ports TCP/UDP) ; une requête vers un site web opère au niveau application (HTTP par-dessus TCP).

## Adressage IP

Une IPv4 est composée de 4 octets (0-255) : `192.168.1.10`. Les plages privées (non routables sur Internet) à reconnaître immédiatement :

- `10.0.0.0/8`
- `172.16.0.0/12`
- `192.168.0.0/16`

Le `/24`, `/8`... c'est le **CIDR**, qui indique combien de bits sont réservés au réseau. Un `/24` (masque `255.255.255.0`) donne 256 adresses possibles (254 utilisables), typique d'un réseau local domestique ou de lab. Plus le chiffre après le `/` est petit, plus le réseau contient d'adresses.

```bash
ip addr show          # voir tes interfaces et IPs
ip route               # voir la table de routage, dont la passerelle par défaut
```

## TCP vs UDP

**TCP** établit une connexion fiable avec accusé de réception (le fameux "three-way handshake" : SYN → SYN-ACK → ACK). Utilisé quand la fiabilité compte : HTTP, SSH, bases de données. C'est aussi la base du scan Nmap classique : envoyer un SYN et observer la réponse permet de déterminer si un port est ouvert, fermé, ou filtré sans même établir la connexion complète.

**UDP** envoie les paquets sans connexion ni garantie de livraison. Plus rapide, utilisé pour DNS, DHCP, streaming. Plus difficile à scanner (pas de handshake à observer), donc souvent ignoré par erreur en reconnaissance — une négligence classique.

## Ports à connaître par cœur

| Port | Service |
|---|---|
| 21 | FTP |
| 22 | SSH |
| 23 | Telnet (non chiffré, rarement légitime aujourd'hui) |
| 25 | SMTP |
| 53 | DNS |
| 80 / 443 | HTTP / HTTPS |
| 445 | SMB (partage de fichiers Windows) |
| 3306 | MySQL |
| 3389 | RDP |

Un port ouvert = un service qui écoute = une surface d'attaque potentielle. La toute première étape de toute reconnaissance réseau consiste à identifier quels ports sont ouverts sur une cible (voir le cours Nmap juste après celui-ci).

## DNS en une minute

DNS traduit un nom de domaine en adresse IP. `nslookup example.com` ou `dig example.com` interrogent le DNS. En reconnaissance offensive, l'énumération DNS (sous-domaines, enregistrements MX, etc.) est une mine d'informations sur l'infrastructure d'une cible — approfondi dans le cours OSINT plus tard dans la roadmap.

## Pièges fréquents

- Confondre adresse réseau et adresse de broadcast dans un `/24` (le `.0` et le `.255` ne sont pas des hôtes utilisables).
- Croire qu'un port fermé est forcément un port qui n'existe pas — il peut aussi être filtré par un firewall, ce qui se comporte différemment lors d'un scan.
- Oublier qu'UDP existe : beaucoup de débutants ne scannent que TCP et ratent des services (SNMP, DNS...) qui tournent en UDP.

## Pour le lab

TryHackMe **Pre-Security** revoit exactement ces notions avec des exercices interactifs, et le lab Wireshark te permet d'observer un handshake TCP en direct, paquet par paquet — la meilleure façon de faire "cliquer" la théorie ci-dessus.
