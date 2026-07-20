Un pentester ou un blue teamer qui ne sait pas scripter répète les mêmes commandes à la main pendant que les autres automatisent. Bash permet d'enchaîner des commandes, de traiter des résultats, et de construire tes propres petits outils de reconnaissance.

## Objectifs

- Écrire un script bash exécutable avec variables, conditions, boucles
- Traiter du texte (grep, sed, awk, cut) pour extraire l'information utile
- Automatiser une tâche répétitive de reconnaissance

## Structure d'un script

```bash
#!/bin/bash
# Le shebang ci-dessus dit au système quel interpréteur utiliser

NAME="monde"
echo "Bonjour, $NAME"

if [ -z "$1" ]; then
  echo "Usage: $0 <cible>"
  exit 1
fi

TARGET=$1
echo "Cible reçue : $TARGET"
```

Rendre exécutable et lancer : `chmod +x script.sh && ./script.sh 10.10.10.5`. `$1`, `$2`... sont les arguments passés au script ; `$0` est le nom du script lui-même ; `$#` le nombre d'arguments.

## Conditions et boucles

```bash
if [ "$STATUS" == "200" ]; then
  echo "Cible accessible"
elif [ "$STATUS" == "403" ]; then
  echo "Accès refusé"
else
  echo "Autre code : $STATUS"
fi

for ip in $(cat ips.txt); do
  ping -c 1 -W 1 "$ip" > /dev/null && echo "$ip est up"
done

while read -r line; do
  echo "Ligne : $line"
done < fichier.txt
```

`[ -z "$1" ]` teste si une variable est vide, `[ -f fichier ]` teste si un fichier existe, `[ -d dossier ]` si c'est un dossier. Toujours mettre les variables entre guillemets (`"$var"`) pour éviter les problèmes si la valeur contient des espaces.

## Traiter du texte : le trio grep / sed / awk

- **grep** : filtrer des lignes qui matchent un motif. `grep -i "error" log.txt` (insensible à la casse), `grep -E "^[0-9]+"` (regex étendue), `grep -v "debug"` (exclure).
- **cut** : découper une ligne par séparateur. `cut -d: -f1 /etc/passwd` extrait le premier champ (le nom d'utilisateur) d'un fichier séparé par `:`.
- **awk** : le plus puissant des trois, traite ligne par ligne avec des colonnes. `awk -F: '{print $1}' /etc/passwd` fait la même chose que le cut ci-dessus. `awk '{print $2}'` par défaut découpe sur les espaces.
- **sed** : remplacer du texte. `sed 's/http/https/g' urls.txt` remplace toutes les occurrences.

```bash
# Exemple concret : extraire toutes les IP d'un fichier de logs Nmap
grep -oE "([0-9]{1,3}\.){3}[0-9]{1,3}" scan.txt | sort -u
```

`sort -u` trie et déduplique — très utile en fin de pipeline pour nettoyer une liste d'IPs, de sous-domaines ou d'URLs récoltées.

## Pipes et redirections

Le pipe `|` envoie la sortie d'une commande en entrée de la suivante — c'est la base de tout script d'automatisation offensive. `>` écrase un fichier, `>>` ajoute à la fin, `2>&1` redirige les erreurs vers la sortie standard (utile pour tout logguer dans un seul fichier).

```bash
nmap -p- 10.10.10.5 | grep open | cut -d/ -f1 > ports_ouverts.txt
```

## Pièges fréquents

- Oublier les guillemets autour des variables → un script qui casse dès qu'un nom de fichier contient un espace.
- Confondre `=` (affectation, pas d'espaces : `x=5`) et `==` (comparaison, dans des crochets).
- Espaces autour du `=` dans une affectation bash : `x = 5` est une erreur, ce n'est pas Python.

## Pour le lab

Le lab bash de TryHackMe te fait écrire des scripts qui parsent des fichiers de logs et automatisent des vérifications — exactement les mêmes constructions (boucles, grep, awk) que celles utilisées ici pour construire de petits outils de reconnaissance.
