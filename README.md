# OL Chauffage Sanitaire Sàrl — site web

Version complète statique + formulaire PHP, prête à être déposée sur un hébergement FTP classique.

## Contenu

- `index.html` — page principale
- `style.css` — design responsive complet
- `script.js` — menu, animations, navigation active, formulaire
- `contact.php` — envoi du formulaire vers `olchauffage@gmail.com`
- `mentions-legales.html`
- `politique-confidentialite.html`
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- favicons + logos officiels dans `assets/`

## Informations intégrées

- Téléphone : 079 521 86 84
- E-mail : olchauffage@gmail.com
- Adresse : Z.I. Grands-Longs-Champs 7, 1562 Corcelles-près-Payerne
- Horaires : lundi à samedi, 07:00–17:00 ; dimanche fermé
- Domaines : chauffage, sanitaire, ventilation
- Fondation : 2020
- IDE : CHE-460.623.141
- Registre du commerce : CH-550.1.189.079-0
- Gérant : Liridon Osmanaj
- Brevet fédéral et formation de formateur d’apprentis
- Services affichés : pompes à chaleur, solaire thermique, chauffage au sol, radiateurs, sanitaire intérieur/extérieur, dépannage sanitaire de jour, double flux, etc.

## Formulaire

Le formulaire utilise `contact.php` et la fonction PHP `mail()`.

Avant la mise en ligne :
1. vérifier que l’hébergement supporte PHP 7.4+ ;
2. vérifier que `mail()` ou le système de courrier sortant du serveur est actif ;
3. faire un envoi de test réel après déploiement.

Si le serveur ne permet pas `mail()`, remplacer le backend par SMTP ou Formspree.

## Domaine

Le SEO est configuré pour :

`https://www.olchauffage.com/`

Si le futur domaine change, remplacer cette URL dans :
- `index.html`
- `mentions-legales.html`
- `politique-confidentialite.html`
- `robots.txt`
- `sitemap.xml`

## Avis Google

Le site affiche `4,6/5 · 10 avis Google`, donnée fournie pour ce projet. Le JSON-LD ne contient volontairement pas d’`aggregateRating` auto-déclaré.

## Photos de chantiers

La version actuelle ne présente aucune photo de banque d’images comme une réalisation réelle de l’entreprise. Le site repose volontairement sur un design graphique/technique premium.

Pour améliorer encore la crédibilité plus tard, le meilleur ajout serait une galerie de vraies photos de chantiers et de l’équipe.

## Déploiement

Déposer le contenu du dossier à la racine web du domaine. Activer HTTPS, puis tester :

- navigation mobile ;
- bouton d’appel ;
- formulaire ;
- carte Google Maps ;
- pages légales ;
- affichage sur iPhone/Android et desktop.
