# Site OL Chauffage Sanitaire Sàrl

Site vitrine one-page — chauffage, sanitaire et ventilation
Z.I. Grands-Longs-Champs 7, 1562 Corcelles-près-Payerne

HTML5 / CSS3 / JavaScript vanilla. Aucune dépendance, aucun build : les fichiers
se déposent tels quels sur un FTP classique (ou sur GitHub Pages).

---

## Arborescence

```
/
├── index.html                     page principale
├── mentions-legales.html
├── politique-confidentialite.html
├── style.css                      variables CSS + mobile-first
├── script.js                      menu, scroll, filtres, formulaire
├── robots.txt
├── sitemap.xml
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
└── assets/
    ├── icons/
    │   ├── icon-192.png
    │   └── icon-512.png
    └── images/
        ├── logo-ol.png                    logo officiel détouré (version verticale)
        ├── logo-ol-blanc.png              même logo, texte blanc (fonds sombres)
        ├── logo-ol-horizontal.png         version navbar (symbole + texte côte à côte)
        ├── logo-ol-horizontal-blanc.png   version footer
        ├── logo-ol-symbole.png            symbole OL seul (base des favicons)
        ├── og-image.jpg                   1200x630, partage réseaux sociaux
        └── placeholder-*.svg              11 emplacements photo
```

---

## À compléter avant mise en ligne

Tous les emplacements sont repérés dans le navigateur par un surlignage rouge
(classe CSS `a-completer`). Une fois l'information saisie, **supprimer la classe
`a-completer`** sur l'élément concerné : le surlignage disparaît.

### 1. Coordonnées (apparaissent à 3 endroits)

| Info | Fichier | Emplacements |
|---|---|---|
| Téléphone | `index.html` | bandeau info, section contact, footer |
| E-mail | `index.html` | bandeau info, section contact, footer |
| Horaires | `index.html` | bandeau info, section contact |

Penser aux liens : `href="tel:+41XXXXXXXXX"` et `href="mailto:..."`.

### 2. Fiche entreprise (section « L’entreprise »)

Année de création, collaborateurs, certifications, zone d’intervention.
Les lignes non souhaitées peuvent simplement être supprimées.

### 3. Avis Google

- Bouton « Voir les avis Google » : remplacer `href="#"` par l’URL de la fiche Google Business.
- Les 3 cartes d’avis sont des emplacements vides — y coller de vrais avis
  (nom + texte). **Aucun faux avis n’a été écrit.**

### 4. Services

Les textes des 3 services sont volontairement factuels et généraux. À valider ou
réécrire avec le client. Pour ajouter des sous-services : décommenter le bloc
`<ul class="service__points">` présent dans chaque service.

### 5. Domaine

Remplacer `https://www.ol-chauffage.ch` par le domaine définitif dans :
`index.html` (canonical, OpenGraph, JSON-LD), `mentions-legales.html`,
`politique-confidentialite.html`, `robots.txt`, `sitemap.xml`.

### 6. Données structurées (JSON-LD, dans `index.html`)

Volontairement limitées aux informations confirmées. À ajouter une fois connues :

```json
"telephone": "+41 XX XXX XX XX",
"email": "contact@exemple.ch",
"geo": { "@type": "GeoCoordinates", "latitude": 46.83, "longitude": 6.95 },
"openingHoursSpecification": [{
  "@type": "OpeningHoursSpecification",
  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
  "opens": "07:30", "closes": "17:00"
}],
"sameAs": ["https://www.google.com/maps/place/..."]
```

> La note 4,6/5 est affichée sur le site (donnée transmise par l’entreprise) mais
> **volontairement absente du balisage `aggregateRating`** : Google ignore et
> peut sanctionner une note auto-déclarée par l’entreprise sur son propre site.
> Les étoiles dans les résultats de recherche viennent de la fiche Google Business.

### 7. Mentions légales / confidentialité

IDE (CHE-…), registre du commerce, responsable de publication, hébergeur, for
juridique, durée de conservation des données, date de mise à jour.

---

## Formulaire de contact

Le formulaire est prêt pour **Formspree** (ou tout backend acceptant un POST
`multipart/form-data` et répondant en JSON).

1. Créer un formulaire sur formspree.io → récupérer l’identifiant.
2. Dans `index.html`, remplacer :
   ```html
   <form ... action="https://formspree.io/f/VOTRE_ID" method="POST">
   ```
3. C’est tout : `script.js` gère la validation, l’état « Envoi en cours… »,
   le message de succès et le message d’erreur.

Tant que `VOTRE_ID` est présent, le formulaire n’envoie rien et affiche un
message explicite. Un champ anti-spam invisible (`_gotcha`) est déjà en place.

**Alternative PHP** (hébergement mutualisé type Infomaniak) : remplacer `action`
par `contact.php` et supprimer le bloc `fetch` dans `script.js`.

---

## Images à remplacer (11)

| Fichier placeholder | Emplacement | Format conseillé |
|---|---|---|
| `placeholder-hero.svg` | Hero | vertical ~1200×1400, WebP |
| `placeholder-chauffage.svg` | Service chauffage | 1200×800, WebP |
| `placeholder-sanitaire.svg` | Service sanitaire | 1200×800, WebP |
| `placeholder-ventilation.svg` | Service ventilation | 1200×800, WebP |
| `placeholder-entreprise.svg` | Section entreprise | 1200×900, WebP |
| `placeholder-realisation-1…6.svg` | Galerie réalisations | 1200×800, WebP |

Aucune photo de banque d’images n’a été utilisée : rien ne peut être pris pour un
chantier réel de l’entreprise. Penser à mettre à jour les attributs `alt` et à
conserver `width`/`height` (évite les sauts de mise en page).

Pour ajouter une réalisation : dupliquer un `<figure class="galerie__item">` et
adapter `data-cat` (`chauffage` | `sanitaire` | `ventilation`). Les filtres
fonctionnent automatiquement.

---

## Logo

Le logo officiel fourni (PNG, fond blanc, composition verticale) a été détouré
sans être redessiné : fond blanc supprimé, couleurs d’origine conservées
(bleu `#1F57A7`, rouge `#EE2F2D`, noir `#231F20`).

Pour la navbar, le symbole et le bloc texte ont été replacés côte à côte
(`logo-ol-horizontal.png`) : en composition verticale, à hauteur de navbar, les
deux lignes de texte devenaient illisibles.

Pour revenir à la version verticale d’origine, remplacer dans `index.html` :

```html
<img src="assets/images/logo-ol-horizontal.png" ... width="1016" height="200">
<!-- par -->
<img src="assets/images/logo-ol.png" ... width="577" height="320">
```

et ajuster `.header__logo img { height: … }` dans `style.css`.

---

## Personnalisation rapide

Tout est piloté par des variables CSS en haut de `style.css` :

```css
--bleu, --bleu-fonce, --bleu-nuit, --bleu-pale
--rouge, --rouge-fonce
--encre, --graphite, --nuit
--r-sm, --r-md            rayons
--sh-sm, --sh-md, --sh-lg ombres
--esp-1 … --esp-6         espacements
--section-y               hauteur des sections
--max-w, --gouttiere      largeurs
--font-titre, --font-texte
```

---

## Tests effectués

Testé dans Chromium (Playwright) :

- largeurs 320 / 375 / 390 / 430 / 768 / 1024 / 1440 / 1920 px — aucun
  débordement horizontal (vérifié également en neutralisant `overflow-x`) ;
- menu mobile : ouverture, fermeture au clic sur un lien, touche Échap, overlay ;
- ancres : le header ne recouvre pas les titres de section ;
- filtres de la galerie ;
- formulaire : champs requis, validation, message d’erreur, message de blocage
  tant que Formspree n’est pas configuré (aucun envoi réel déclenché) ;
- aucune erreur JavaScript, aucune ancre morte.

**Non vérifiable dans l’environnement de test** (réseau sortant restreint) :
le rendu des polices Google Fonts (Barlow / Barlow Condensed) et l’affichage de
la carte Google Maps. À contrôler visuellement après le premier déploiement.

---

## Mise en ligne

**FTP** : déposer le contenu du dossier à la racine du site (`/web` ou
`/public_html` selon l’hébergeur). Vérifier que HTTPS est actif.

**GitHub Pages** : Settings → Pages → Branch `main` / dossier `/ (root)`.
Le fichier `.nojekyll` est déjà présent.

Après mise en ligne : soumettre `sitemap.xml` dans Google Search Console et
vérifier le JSON-LD avec le test des résultats enrichis de Google.

---

Site réalisé par [Darko Spasenov](https://ds-digital.ch) — DS Digital Studio.
