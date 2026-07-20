Les mots de passe restent le maillon faible numéro un de la sécurité. Ce cours couvre les grandes familles d'attaques de mots de passe — brute-force, dictionnaire, credential stuffing — et les bases du cassage de hash.

## Objectifs

- Distinguer brute-force, attaque par dictionnaire, et attaques hybrides
- Comprendre pourquoi le hachage seul ne suffit pas (et le rôle du salage)
- Utiliser Hydra et Hashcat pour les deux grandes catégories d'attaque (en ligne / hors ligne)

## Attaques en ligne vs hors ligne

**Attaque en ligne** : tester des mots de passe directement contre un service actif (formulaire de login, SSH, RDP...). Limitée par la latence réseau et les mécanismes de protection (verrouillage de compte, rate limiting, CAPTCHA).

**Attaque hors ligne** : une fois des hash de mots de passe récupérés (base de données volée, fichier `/etc/shadow`...), les tester localement sans limite de vitesse autre que la puissance de calcul disponible — bien plus rapide, sans risque de déclencher une alerte de sécurité côté cible.

## Dictionnaire vs brute-force

**Brute-force pur** : tester toutes les combinaisons possibles de caractères. Exhaustif mais extrêmement lent dès que le mot de passe dépasse quelques caractères — un mot de passe de 8 caractères alphanumériques représente déjà des dizaines de milliards de combinaisons.

**Attaque par dictionnaire** : tester une liste de mots de passe probables (rockyou.txt, la wordlist la plus connue, contient 14 millions de mots de passe réels issus de fuites). Bien plus efficace en pratique, car la majorité des utilisateurs réutilisent des schémas prévisibles.

**Attaque hybride** : combiner un dictionnaire avec des règles de mutation (`password` → `Password1!`, ajout d'années, substitutions de caractères comme `a`→`@`) — capture les variations que les gens créent à partir de mots de passe simples pour "respecter" des politiques de complexité.

## Hydra : attaque en ligne

```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.5
hydra -L users.txt -P passwords.txt 10.10.10.5 http-post-form \
  "/login:user=^USER^&pass=^PASS^:Invalid credentials"
```

`-l` fixe un utilisateur unique, `-L` teste une liste d'utilisateurs ; `-P` fournit la liste de mots de passe. Le module `http-post-form` demande de préciser le chemin, le format des paramètres, et une chaîne qui indique un échec — Hydra compare chaque réponse à cette chaîne pour savoir si la tentative a réussi.

## Hashcat : cassage hors ligne

Un hash n'est pas chiffré, il est à sens unique : impossible de le "déchiffrer", seulement de tester des mots de passe candidats et comparer leur hash au hash cible.

```bash
hashcat -m 0 -a 0 hashes.txt rockyou.txt          # MD5, mode dictionnaire
hashcat -m 1000 -a 0 hashes.txt rockyou.txt -r best64.rule  # NTLM + règles de mutation
```

`-m` précise le type de hash (0 = MD5, 1000 = NTLM, 1800 = sha512crypt...) — identifier correctement le type de hash est la première étape, souvent via son format ou des outils comme `hashid`. `-a 0` = mode dictionnaire, `-a 3` = brute-force pur avec masque de caractères.

## Pourquoi le salage compte

Sans sel, deux utilisateurs avec le même mot de passe ont le même hash — visible immédiatement, et cassable une fois pour toutes via des **rainbow tables** (tables précalculées hash → mot de passe). Un **sel** (valeur aléatoire unique ajoutée avant hachage) rend chaque hash unique même pour un mot de passe identique, et invalide les rainbow tables précalculées : chaque hash doit être cassé individuellement.

Les fonctions modernes (`bcrypt`, `argon2`) intègrent nativement le salage et sont volontairement lentes à calculer — un facteur de coût réglable ralentit délibérément chaque tentative de hachage, rendant le cassage hors ligne des milliers de fois plus coûteux qu'avec un simple MD5.

## Credential stuffing

Attaque qui exploite la réutilisation de mots de passe : des identifiants volés sur un service A (via une fuite de données publique) sont testés automatiquement sur un service B. Fonctionne à grande échelle précisément parce que la réutilisation de mot de passe reste très répandue — une des raisons pour lesquelles l'authentification multi-facteurs (MFA) est devenue incontournable.

## Pièges fréquents

- Lancer un brute-force en ligne agressif sans réfléchir aux mécanismes de verrouillage — bloque le compte cible au lieu de le compromettre, et génère une alerte de sécurité immédiate.
- Confondre chiffrement et hachage — un hash ne se "déchiffre" jamais, il se recalcule et se compare.
- Ignorer l'identification du type de hash avant de lancer Hashcat — un mauvais `-m` fait échouer silencieusement une attaque qui aurait dû réussir.

## Pour le lab

Le module **TryHackMe** dédié aux attaques de mots de passe fait pratiquer Hydra sur un service en ligne et Hashcat sur des hash extraits, avec l'identification du type de hash comme première étape obligatoire — exactement le déroulé de ce cours.
