Active Directory (AD) gère l'authentification et les autorisations dans la quasi-totalité des réseaux d'entreprise sous Windows. Comprendre AD est indispensable en pentest interne : la majorité des compromissions réelles passent par une chaîne de mauvaises configurations AD plutôt que par une seule faille logicielle spectaculaire.

## Objectifs

- Comprendre la structure d'un domaine AD (utilisateurs, groupes, GPO, contrôleur de domaine)
- Connaître le rôle de Kerberos dans l'authentification AD
- Reconnaître les attaques AD les plus courantes : Kerberoasting, Pass-the-Hash

## Structure d'un domaine

Un **contrôleur de domaine (DC)** est le serveur central qui héberge l'annuaire AD : tous les comptes utilisateurs, ordinateurs, groupes de sécurité, et les règles qui s'appliquent à eux. Les **Group Policy Objects (GPO)** définissent des configurations appliquées automatiquement à des ensembles d'utilisateurs ou de machines (mots de passe, restrictions logicielles, mappages de lecteurs réseau...).

La hiérarchie typique : **Forêt** (plusieurs domaines) → **Domaine** → **Unités d'organisation (OU)** qui regroupent utilisateurs et machines de façon logique (par service, par site...).

Un compte à privilèges élevés critique : les membres du groupe **Domain Admins** ont un contrôle total sur le domaine — l'objectif final de la plupart des chemins d'attaque AD est d'obtenir, directement ou indirectement, ces privilèges.

## Kerberos, en bref

Kerberos est le protocole d'authentification utilisé par AD, basé sur des **tickets** plutôt que sur l'envoi direct de mots de passe :

1. L'utilisateur s'authentifie une fois auprès du contrôleur de domaine et reçoit un **TGT** (Ticket Granting Ticket).
2. Pour accéder à un service précis, il présente ce TGT et reçoit un **TGS** (Ticket Granting Service), spécifique à ce service.
3. Le service accepte le TGS sans revérifier le mot de passe — le ticket suffit.

Ce mécanisme évite de retransmettre le mot de passe à chaque service, mais crée une surface d'attaque propre aux tickets eux-mêmes (voir Kerberoasting ci-dessous).

## Kerberoasting

Tout compte de service (utilisé par une application pour tourner, pas un humain) associé à un **Service Principal Name (SPN)** peut se voir demander un TGS par n'importe quel utilisateur authentifié du domaine — sans droits particuliers. Ce TGS est chiffré avec le hash du mot de passe du compte de service.

L'attaque : demander ce TGS, puis le casser hors ligne avec Hashcat (revois le cours Password Attacks) pour retrouver le mot de passe du compte de service en clair. Les comptes de service ont souvent des mots de passe anciens, jamais changés, et parfois avec des privilèges élevés — une cible de choix.

```
1. Énumérer les comptes avec SPN (ex: outil Rubeus, Impacket GetUserSPNs.py)
2. Demander un ticket TGS pour ce compte
3. Extraire le hash du ticket et le soumettre à Hashcat (mode 13100)
```

## Pass-the-Hash

Windows stocke localement un hash NTLM du mot de passe pour l'authentification. Pass-the-Hash exploite le fait que certains protocoles (SMB, RDP dans certaines configs) acceptent directement ce hash pour s'authentifier — **sans jamais avoir besoin de connaître le mot de passe en clair**. Si un attaquant récupère le hash NTLM d'un compte (via un dump mémoire, un accès local...), il peut s'authentifier sur d'autres machines du domaine où ce compte a des droits, sans casser le hash.

C'est une des raisons pour lesquelles la réutilisation d'un même compte administrateur local sur plusieurs machines est dangereuse : compromettre une seule machine où ce compte est connecté permet de rebondir vers toutes les autres.

## BloodHound : cartographier les chemins d'attaque

AD est complexe : des centaines d'utilisateurs, groupes, et relations de permissions imbriquées créent souvent des chemins d'escalade non-évidents (utilisateur A est membre du groupe B, qui a le droit de réinitialiser le mot de passe du groupe C, qui est Domain Admin...). **BloodHound** collecte ces relations et les visualise sous forme de graphe, révélant automatiquement les chemins les plus courts vers Domain Admin — l'outil de référence pour l'analyse AD offensive et défensive.

## Pièges fréquents

- Négliger les comptes de service (souvent créés une fois et jamais revus) alors qu'ils sont une cible privilégiée pour le Kerberoasting.
- Se concentrer uniquement sur l'exploitation logicielle et ignorer les mauvaises configurations de permissions, la source la plus fréquente de compromission AD réelle.
- Oublier qu'un accès local sur une seule machine peut suffire à progresser dans tout le domaine via le mouvement latéral (Pass-the-Hash, sessions de comptes privilégiés).

## Pour le lab

Les labs **HTB** dédiés à Active Directory (souvent regroupés dans des tracks spécifiques) font pratiquer l'énumération, le Kerberoasting et l'analyse BloodHound sur des environnements de domaine réalistes, reproduisant les chemins d'attaque décrits ci-dessus.
