# Propositions (à décider, rien n'est codé)

Prix relevés le 23 novembre 2026. Ils changent souvent : revérifier sur les pages officielles avant de choisir.

## 1. Outil d'envoi des annonces de parution

### Le besoin

- Environ 52 envois par an (un par baromètre).
- Un lien de désinscription automatique dans chaque e-mail.
- Une liste gérée par l'équipe, sans développeur.

Aujourd'hui, chaque inscription arrive par e-mail à `contacts@bigfiveabidjan.com`, et l'équipe tient la liste à la main. Ce fonctionnement ne change pas : la politique de confidentialité reste telle quelle.

### Comparaison des offres gratuites

| | Brevo | MailerLite | Mailchimp |
|---|---|---|---|
| Contacts | 100 000 | 250 actifs | 250 |
| Envois | 300 par jour | 2 500 par 30 jours | 500 par mois, 250 par jour |
| Limite atteinte | Le reste de la campagne doit être relancé à la main, 300 par jour | L'envoi est mis en pause jusqu'au mois suivant | L'envoi est mis en pause |
| Utilisateurs | 1 | non vérifié | non vérifié |
| Désinscription automatique | oui | oui | oui |
| Premier prix payant | 9 $ par mois (Starter) | 12 $ par mois (Comfort) | non vérifié |

### Ce que cela donne pour BIG FIVE

Avec un envoi par semaine, le plafond dépend du nombre d'inscrits :

| Nombre d'inscrits | Brevo gratuit | MailerLite gratuit | Mailchimp gratuit |
|---|---|---|---|
| Jusqu'à 125 | suffit | suffit | suffit (4 envois × 125 = 500) |
| 126 à 250 | suffit | suffit | insuffisant |
| 251 à 300 | suffit | insuffisant | insuffisant |
| Plus de 300 | payant, ou envoi étalé sur plusieurs jours | payant | payant |

### Recommandation

**Brevo.** C'est l'offre gratuite qui tient le plus longtemps : elle couvre jusqu'à 300 inscrits pour un envoi hebdomadaire, sans plafond de contacts gênant. Au-delà, le premier palier payant reste le moins cher des trois.

Autre avantage : Brevo sait aussi envoyer les e-mails des formulaires du site. Un seul outil, un seul réglage du nom de domaine.

Limite à connaître : un seul utilisateur sur l'offre gratuite.

### À faire si BIG FIVE dit oui

1. Créer le compte Brevo au nom de BIG FIVE.
2. Vérifier le domaine d'envoi (enregistrements SPF et DKIM chez l'hébergeur du nom de domaine).
3. Importer la liste tenue à la main.
4. Relier le formulaire « Me notifier » du site à la liste Brevo.
5. Mettre à jour la politique de confidentialité : Brevo devient un prestataire qui reçoit les adresses.

### Sources

- Brevo, limites de l'offre gratuite : https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan
- Brevo, tarifs : https://www.brevo.com/pricing/
- MailerLite, tarifs : https://www.mailerlite.com/pricing
- MailerLite, offre gratuite : https://www.mailerlite.com/free-plan
- MailerLite, offres et facturation : https://www.mailerlite.com/help/plan-and-billing
- Mailchimp, tarifs : https://mailchimp.com/pricing/marketing/
- Mailchimp, description des offres : https://mailchimp.com/help/about-mailchimp-pricing-plans/

Les montants Brevo sont affichés en dollars sur la page officielle ; un affichage en euros (à partir de 7 €) existe selon le pays.

## 2. Garder le PDF du baromètre strictement interne

### Ce qui existe déjà

- La fiche d'un baromètre contient un champ « Ressource interne » : un lien vers le PDF.
- Ce champ est lisible seulement par un compte connecté à l'administration.
- Il n'est ni dans le HTML des pages, ni dans l'interface publique des données. Un test automatique le vérifie à chaque livraison.

### La limite actuelle

Le champ contient un simple lien. Si ce lien pointe vers un fichier ouvert à tous (Drive partagé « toute personne disposant du lien », lien raccourci), une personne qui obtient le lien peut ouvrir le PDF. Le site ne peut pas l'empêcher.

### Proposition

1. **Stockage privé.** Le PDF est envoyé depuis l'administration vers un espace de stockage fermé, sans adresse publique.
2. **Accès réservé aux comptes connectés.** Seul un membre de l'équipe connecté peut demander le fichier.
3. **Lien signé à durée courte.** À chaque demande, le site crée un lien valable 5 minutes. Passé ce délai, le lien ne fonctionne plus. Un lien transféré par erreur devient donc inutile.
4. **Jamais dans l'interface publique ni dans le HTML.** Le fichier est rangé dans une collection séparée des baromètres, sans aucun droit de lecture pour le public.
5. **Trace.** Chaque téléchargement est noté : qui, quand, quel baromètre.

### Ce que cela change pour l'équipe

- Au lieu de coller un lien, on envoie le PDF dans la fiche du baromètre.
- Pour le transmettre à un prospect, on le télécharge depuis l'administration, puis on l'envoie par e-mail comme aujourd'hui.

### Effort

Environ une journée de développement, tests compris.
