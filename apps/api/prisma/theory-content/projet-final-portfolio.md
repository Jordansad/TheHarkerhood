Ce dernier module ne porte pas sur une technique offensive ou défensive, mais sur ce qui transforme 12 mois d'apprentissage en une preuve de compétence concrète, visible par des recruteurs ou des clients : ton portfolio. C'est souvent l'étape la plus négligée, alors qu'elle conditionne directement les opportunités qui suivent.

## Objectifs

- Structurer un portfolio GitHub qui reflète réellement tes compétences
- Constituer un ensemble cohérent de write-ups couvrant différentes catégories
- Préparer une présentation de projet claire pour un entretien ou une candidature

## Pourquoi le portfolio compte autant que les compétences elles-mêmes

Un recruteur technique en cybersécurité ne peut pas directement observer ce que tu sais faire — il ne voit que ce que tu peux **montrer**. Deux profils avec des compétences réelles équivalentes ne se départagent, en pratique, que par la qualité de ce qui est documenté et présentable. Le module Git & Documentation posait les bases ; ce module consiste à assembler ces bases en un ensemble cohérent.

## Structure d'un portfolio GitHub efficace

```
mon-portfolio/
├── README.md              # vue d'ensemble : qui tu es, ce que tu sais faire, liens vers le reste
├── writeups/
│   ├── htb-machines/       # write-ups de machines Hack The Box résolues
│   ├── thm-rooms/          # write-ups TryHackMe
│   └── ctf/                 # write-ups de CTF auxquels tu as participé
├── tools/                  # scripts et outils développés (scanner, parseur...)
├── reports/                # exemples de rapports de pentest (sur des labs, jamais de vraies cibles réelles)
└── certifications/          # certificats obtenus, avec liens de vérification
```

Le `README.md` racine est ce que la plupart des visiteurs liront en premier et peut-être en dernier — il doit répondre en quelques secondes à "que sait faire cette personne ?" avec des liens directs vers les preuves les plus solides, pas une liste exhaustive de tout ce qui existe dans le dépôt.

## Diversité plutôt que volume

Dix write-ups qui couvrent tous la même catégorie de vulnérabilité (dix injections SQL, par exemple) démontrent moins de valeur que cinq write-ups qui couvrent des domaines différents de la roadmap : une machine Linux avec privesc SUID, un scénario Active Directory, une analyse forensique, un rapport d'API avec BOLA, une participation à un CTF blue team. La diversité prouve une compréhension transversale plutôt qu'une répétition d'un seul type d'exercice.

## Le portfolio de compétences défensives, souvent oublié

Beaucoup de portfolios débutants ne montrent que des write-ups offensifs (machines compromises, CTF résolus). Si la roadmap suivie couvre aussi le blue team et la forensique (modules Blue Team — SOC Basics, Forensics & Incident Response), inclure au moins une investigation documentée équilibre le profil et correspond à une réalité du marché : les postes purement offensifs sont numériquement bien moins nombreux que les postes défensifs (SOC, IR, GRC).

## Préparer la présentation orale

Un portfolio écrit ne suffit pas en entretien — être capable d'expliquer oralement, en quelques minutes, le raisonnement derrière un write-up choisi est tout aussi important :

- Quel était le point d'entrée initial, et comment l'as-tu trouvé ?
- Quelles pistes as-tu explorées qui n'ont pas fonctionné, et comment as-tu pivoté ?
- Quel a été le moment de blocage principal, et comment l'as-tu résolu ?

Cette dernière question en particulier révèle la vraie méthodologie de résolution de problème — bien plus révélatrice pour un recruteur technique que le simple fait d'avoir obtenu le flag final.

## CV technique : ce qui compte vraiment

- Lister les certifications avec leur niveau exact (revois le Manuel Officiel pour la liste eJPT, Security+, CPTS, OSCP...) plutôt que des formulations vagues ("connaissances en sécurité")
- Quantifier quand c'est possible : nombre de machines résolues, nombre de CTF, plateforme et classement si pertinent
- Lien direct vers le portfolio GitHub en évidence, pas enterré en bas de page

## Pièges fréquents

- Un portfolio avec beaucoup de dépôts vides ou de projets abandonnés à mi-chemin — mieux vaut 5 projets aboutis que 20 ébauches.
- Copier-coller la structure d'un write-up trouvé en ligne sans y ajouter sa propre analyse et son propre raisonnement — un recruteur expérimenté le repère immédiatement.
- Négliger le README principal, qui est souvent la seule chose réellement lue avant qu'un recruteur ne décide de creuser ou de passer au profil suivant.

## Pour la suite

Ce module clôt la roadmap technique des 12 mois, mais le portfolio, lui, ne se termine jamais vraiment : chaque nouveau lab, CTF ou certification obtenue mérite d'y être ajouté — c'est un projet vivant qui continue de démontrer ta progression bien après la fin de ce programme.
