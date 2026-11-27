# Publier un baromètre

Guide pour l'équipe BIG FIVE. Aucun développeur n'est nécessaire.

Temps à prévoir : 10 minutes par baromètre.

Le site s'administre avec **Nuxt Studio**. Chaque enregistrement est mis en ligne en 1 à 2 minutes.

## Avant de commencer

Vous vous connectez avec votre compte Google. Votre adresse doit être autorisée : si ce n'est pas fait, envoyez-la au développeur.

Préparez ces éléments :

| Élément | Règle |
|---|---|
| Titre | Une question. 110 caractères au maximum. |
| Date de parution | Au format AAAA-MM-JJ. Exemple : `2026-12-01`. |
| Périmètre | 3 éléments courts. Exemple : « 3 opérateurs télécoms ». |
| Chiffres clés | 3 chiffres. Pour chacun : la valeur, un libellé court, une phrase d'explication. |
| À retenir | Une phrase. 200 caractères au maximum. |
| Couverture | Une image. Voir les règles ci-dessous. |

**Le lien du PDF complet ne doit jamais être saisi sur le site.** Le contenu du site est public. Gardez ce lien dans vos outils internes.

## L'image de couverture

| Règle | Valeur |
|---|---|
| Type de fichier | JPG ou PNG |
| Largeur minimale | 1000 pixels |
| Poids maximal | 500 Ko |
| Contenu | Aucun lien, aucune adresse web et aucun QR code imprimés dans l'image |

Pour alléger une image trop lourde, utilisez un outil gratuit comme [Squoosh](https://squoosh.app).

> [À COMPLÉTER : format de couverture à confirmer, 16:9 ou portrait (1121 × 1403). Le site accepte les deux.]

## Les étapes

### 1. Se connecter

1. Ouvrez `https://bigfive.solutions/_studio`.
2. Cliquez sur **Se connecter avec Google** et choisissez votre compte.

### 2. Envoyer la couverture

1. Ouvrez la médiathèque de Studio.
2. Envoyez l'image dans le dossier `images`.

### 3. Créer la fiche

1. Ouvrez le dossier **Barometres**.
2. Créez un fichier nommé `secteur-pays-annee-mois.yml`, en minuscules, sans accent.
   Exemple : `telecoms-ci-2026-08.yml`.

### 4. Remplir la fiche

1. **Identifiant** : le nom du fichier, sans `.yml`. Exemple : `telecoms-ci-2026-08`.
   Il devient l'adresse de la page : `bigfive.solutions/barometres/telecoms-ci-2026-08`.
   Ne le changez plus après la publication.
2. **Date de parution** : au format AAAA-MM-JJ.
3. **Titre** : la question.
4. **Titre affiché dans Google** : 60 caractères au maximum.
   Mettez-y le secteur et le pays. Exemple : « Baromètre télécoms Côte d'Ivoire, août 2026 ».
5. **Périmètre** : les 3 éléments.
6. **Chiffres clés** : les 3 chiffres (chiffre, libellé court, explication).
7. **À retenir** : la phrase.
8. **Image de couverture** : choisissez l'image dans la médiathèque.

### 5. Publier

Vous avez deux choix :

- **Publier tout de suite** : cochez **Publié**, puis cliquez sur **Publier**.
- **Programmer** : cochez **Publié**, mettez une date future dans **Date de parution**, puis cliquez sur **Publier**. Le baromètre reste masqué jusqu'à cette date. Il apparaît le matin du jour prévu.

Pour garder un brouillon, laissez **Publié** décoché.

### 6. Vérifier

1. Attendez 2 minutes.
2. Ouvrez `bigfive.solutions/barometres/<identifiant>`.
3. Relisez la page : titre, chiffres, image.

## Corriger ou retirer un baromètre

- **Corriger** : ouvrez le fichier, modifiez, publiez.
- **Retirer** : décochez **Publié**, publiez. La page disparaît du site.

## En cas de problème

| Symptôme | Que faire |
|---|---|
| La page n'apparaît pas après 5 minutes | Vérifiez que **Publié** est coché et que la date n'est pas future. Sinon, prévenez le développeur. |
| Studio refuse la connexion | Votre adresse Google n'est pas autorisée : envoyez-la au développeur. |
| Une erreur a été publiée | Corrigez et publiez à nouveau. Chaque version est conservée : le développeur peut revenir en arrière. |
