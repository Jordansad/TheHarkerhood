Avant d'exploiter quoi que ce soit, il faut savoir ce qui existe sur la cible. Nmap est l'outil de référence pour la reconnaissance réseau : quels hôtes sont vivants, quels ports sont ouverts, quels services et versions tournent dessus. Toute méthodologie de pentest commence ici.

## Objectifs

- Comprendre les différents types de scan Nmap et ce qu'ils révèlent
- Interpréter correctement un résultat (open / closed / filtered)
- Construire une méthodologie de reconnaissance progressive, du large au précis

## Pourquoi le scan SYN est le standard

Le scan par défaut de Nmap avec privilèges root, `-sS` (SYN scan), envoie un paquet SYN à chaque port et regarde la réponse sans compléter le handshake TCP (revois le cours Networking Essentials si ce terme n'est pas clair) :

- **SYN-ACK reçu** → port **open**, Nmap répond par un RST pour ne jamais établir la connexion complète (plus discret, plus rapide)
- **RST reçu** → port **closed**
- **Aucune réponse** (après retransmissions) → port **filtered**, généralement un firewall qui droppe silencieusement le paquet

`filtered` ne veut pas dire "rien à voir" — au contraire, un firewall qui filtre sélectivement certains ports est souvent un signal qu'il y a quelque chose à protéger derrière.

## Méthodologie de scan progressive

```bash
# 1. Découverte d'hôtes sur un réseau (ping sweep)
nmap -sn 10.10.10.0/24

# 2. Scan rapide des ports les plus courants sur une cible identifiée
nmap -F 10.10.10.5

# 3. Scan complet de tous les ports TCP (plus lent, mais exhaustif)
nmap -p- 10.10.10.5

# 4. Scan détaillé sur les ports trouvés à l'étape 3 : versions, scripts par défaut, OS
nmap -sC -sV -p 22,80,445 -O 10.10.10.5

# 5. Ne jamais oublier UDP — souvent ignoré, souvent révélateur (SNMP, DNS...)
nmap -sU --top-ports 20 10.10.10.5
```

Cette approche en entonnoir (large puis précis) est plus rapide qu'un `-p- -sC -sV` direct sur tous les ports dès le départ, et donne des résultats exploitables progressivement plutôt que d'attendre la fin d'un scan qui peut prendre de longues minutes.

`-sC` lance les scripts NSE par défaut (détection de vulnérabilités connues, bannières...) ; `-sV` détecte les versions précises des services — l'information la plus précieuse, puisqu'une version obsolète pointe directement vers des CVE connues à chercher.

## Lire un résultat Nmap

```
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 7.6p1 Ubuntu
80/tcp   open  http        Apache httpd 2.4.29
445/tcp  open  netbios-ssn Samba smbd 4.7.6
```

Le réflexe immédiat face à ce résultat : chercher "OpenSSH 7.6p1 CVE" et "Samba 4.7.6 CVE" — beaucoup de versions de service ont des vulnérabilités publiques documentées, parfois avec un exploit prêt à l'emploi (voir le cours Metasploit).

## Scripts NSE utiles

Le moteur de scripts Nmap (NSE) va au-delà du scan de port : `nmap --script vuln -p 80 cible` cherche activement des vulnérabilités connues sur le service HTTP ; `nmap --script smb-enum-shares -p 445 cible` énumère les partages SMB accessibles. `nmap --script-help <nom>` documente chaque script.

## Options de discrétion et de vitesse

`-T0` à `-T5` règlent la vitesse (T5 = agressif et bruyant, T2 = lent et discret). `-Pn` désactive la vérification "hôte en vie" au préalable (utile si un firewall bloque le ping mais que des ports répondent quand même). En environnement réel avec détection d'intrusion, un scan `-T5 -p-` se voit immédiatement dans les logs — un scan plus lent et ciblé passe souvent inaperçu.

## Pièges fréquents

- Lancer `-p-` avec `-sC -sV` sur les 65535 ports d'entrée de jeu : très lent, et souvent inutile tant que la reconnaissance rapide n'a pas déjà donné une direction.
- Interpréter `filtered` comme "fermé, rien à faire" — creuser plutôt pourquoi ce port précis est filtré.
- Scanner uniquement en TCP et ignorer complètement UDP.

## Pour le lab

**HTB Starting Point** et le module **TryHackMe Nmap** te font pratiquer exactement cette méthodologie en entonnoir sur des machines réelles, du scan de découverte jusqu'à l'identification d'une version de service exploitable.
