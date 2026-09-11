/* ============================================================
   OL CHAUFFAGE SANITAIRE Sàrl — JavaScript (vanilla, sans dépendance)
   1. Menu mobile
   2. Header au scroll
   3. Lien de navigation actif
   4. Apparition des sections au scroll
   5. Filtres des réalisations
   6. Formulaire de contact (compatible Formspree)
   7. Année automatique du copyright
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. MENU MOBILE ------------------------------- */
  var burger  = document.getElementById('burger');
  var nav     = document.getElementById('nav');
  var overlay = document.getElementById('navOverlay');

  function ouvrirMenu(ouvrir) {
    if (!burger || !nav) return;
    nav.classList.toggle('is-open', ouvrir);
    burger.setAttribute('aria-expanded', ouvrir ? 'true' : 'false');
    burger.setAttribute('aria-label', ouvrir ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.classList.toggle('menu-ouvert', ouvrir);
    if (overlay) {
      if (ouvrir) {
        overlay.hidden = false;
        requestAnimationFrame(function () { overlay.classList.add('is-visible'); });
      } else {
        overlay.classList.remove('is-visible');
        window.setTimeout(function () { overlay.hidden = true; }, 250);
      }
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      ouvrirMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (overlay) overlay.addEventListener('click', function () { ouvrirMenu(false); });

  // Fermeture au clic sur un lien du menu
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) ouvrirMenu(false);
    });
  }

  // Fermeture avec la touche Échap
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') ouvrirMenu(false);
  });

  // Réinitialisation si l'on repasse en affichage ordinateur
  var mqDesktop = window.matchMedia('(min-width: 1000px)');
  var onChange = function (e) { if (e.matches) ouvrirMenu(false); };
  if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', onChange);
  else if (mqDesktop.addListener) mqDesktop.addListener(onChange);

  /* ---------- 2. HEADER AU SCROLL -------------------------- */
  var header = document.getElementById('header');
  var tick = false;

  function majHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
    tick = false;
  }
  window.addEventListener('scroll', function () {
    if (!tick) { window.requestAnimationFrame(majHeader); tick = true; }
  }, { passive: true });
  majHeader();

  /* ---------- 3. LIEN DE NAVIGATION ACTIF ------------------ */
  var liens = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  var sections = liens
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var obsNav = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        liens.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { obsNav.observe(s); });
  }

  /* ---------- 4. APPARITION AU SCROLL ---------------------- */
  var aReveler = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    Array.prototype.forEach.call(aReveler, function (el) { el.classList.add('is-visible'); });
  } else {
    var obsReveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(aReveler, function (el) { obsReveal.observe(el); });
  }

  /* ---------- 5. FILTRES DES RÉALISATIONS ------------------ */
  var filtres = document.querySelectorAll('.filtre');
  var items = document.querySelectorAll('.galerie__item');

  Array.prototype.forEach.call(filtres, function (btn) {
    btn.addEventListener('click', function () {
      var cible = btn.getAttribute('data-filtre');

      Array.prototype.forEach.call(filtres, function (b) {
        b.classList.toggle('is-active', b === btn);
      });

      Array.prototype.forEach.call(items, function (item) {
        var visible = (cible === 'tous' || item.getAttribute('data-cat') === cible);
        item.classList.toggle('is-hidden', !visible);
        if (visible) item.classList.add('is-visible'); // évite un élément resté invisible
      });
    });
  });

  /* ---------- 6. FORMULAIRE DE CONTACT --------------------- */
  /* Connexion Formspree : remplacer l'attribut action du <form>
     par https://formspree.io/f/VOTRE_ID dans index.html.
     Tant que l'identifiant n'est pas renseigné, le formulaire
     n'envoie rien et affiche un message explicite.            */
  var form = document.getElementById('formDevis');
  var statut = document.getElementById('formStatus');

  function afficherStatut(message, type) {
    if (!statut) return;
    statut.textContent = message;
    statut.className = 'form__status' + (type ? ' is-' + type : '');
  }

  if (form) {
    // Retire le signalement d'erreur dès que l'utilisateur corrige
    form.addEventListener('input', function (e) {
      if (e.target.classList) e.target.classList.remove('is-invalid');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validation native + repérage visuel des champs manquants
      var champs = form.querySelectorAll('input[required], select[required], textarea[required]');
      var premierInvalide = null;

      Array.prototype.forEach.call(champs, function (champ) {
        var ok = champ.checkValidity();
        champ.classList.toggle('is-invalid', !ok);
        if (!ok && !premierInvalide) premierInvalide = champ;
      });

      if (premierInvalide) {
        afficherStatut('Merci de compléter les champs signalés en rouge.', 'error');
        premierInvalide.focus();
        return;
      }

      var action = form.getAttribute('action') || '';

      if (action.indexOf('VOTRE_ID') !== -1 || action === '') {
        afficherStatut(
          'Formulaire pas encore connecté : renseigner l’identifiant Formspree dans index.html.',
          'error'
        );
        return;
      }

      var bouton = form.querySelector('button[type="submit"]');
      if (bouton) { bouton.disabled = true; bouton.textContent = 'Envoi en cours…'; }
      afficherStatut('', '');

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (r) {
          if (!r.ok) throw new Error('Erreur ' + r.status);
          form.reset();
          afficherStatut('Merci, votre demande a bien été envoyée. Nous vous répondons rapidement.', 'ok');
        })
        .catch(function () {
          afficherStatut('L’envoi a échoué. Merci de réessayer ou de nous contacter par téléphone.', 'error');
        })
        .finally(function () {
          if (bouton) { bouton.disabled = false; bouton.textContent = 'Envoyer ma demande'; }
        });
    });
  }

  /* ---------- 7. ANNÉE DU COPYRIGHT ------------------------ */
  var annee = document.getElementById('annee');
  if (annee) annee.textContent = new Date().getFullYear();
})();
