(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menuButton = document.getElementById('menuButton');
  var mainNav = document.getElementById('mainNav');
  var menuOverlay = document.getElementById('menuOverlay');
  var siteHeader = document.getElementById('siteHeader');

  function setMenu(open) {
    if (!menuButton || !mainNav) return;
    mainNav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.classList.toggle('menu-open', open);

    if (menuOverlay) {
      if (open) {
        menuOverlay.hidden = false;
        requestAnimationFrame(function () { menuOverlay.classList.add('is-visible'); });
      } else {
        menuOverlay.classList.remove('is-visible');
        window.setTimeout(function () { menuOverlay.hidden = true; }, 280);
      }
    }
  }

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (menuOverlay) menuOverlay.addEventListener('click', function () { setMenu(false); });
  if (mainNav) mainNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenu(false);
  });

  var desktopQuery = window.matchMedia('(min-width: 980px)');
  function closeOnDesktop(event) { if (event.matches) setMenu(false); }
  if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', closeOnDesktop);
  else if (desktopQuery.addListener) desktopQuery.addListener(closeOnDesktop);

  var ticking = false;
  function updateHeader() {
    if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 18);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  updateHeader();

  var reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav__link[href^="#"]'));
  var navSections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window && navSections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
    navSections.forEach(function (section) { navObserver.observe(section); });
  }

  var serviceSelect = document.getElementById('service');
  document.querySelectorAll('.js-service-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!serviceSelect) return;
      var service = link.getAttribute('data-service');
      var exists = Array.prototype.some.call(serviceSelect.options, function (option) { return option.value === service; });
      if (exists) serviceSelect.value = service;
    });
  });

  var form = document.getElementById('quoteForm');
  var formStatus = document.getElementById('formStatus');
  var submitButton = document.getElementById('submitButton');

  function setStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = 'form-status' + (type ? ' is-' + type : '');
  }

  function markInvalidFields() {
    if (!form) return null;
    var firstInvalid = null;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (field) {
      var wrapper = field.type === 'checkbox' ? field.closest('.consent') : field;
      var valid = field.checkValidity();
      if (wrapper) wrapper.classList.toggle('is-invalid', !valid);
      if (!valid && !firstInvalid) firstInvalid = field;
    });
    return firstInvalid;
  }

  if (form) {
    form.addEventListener('input', function (event) {
      var wrapper = event.target.type === 'checkbox' ? event.target.closest('.consent') : event.target;
      if (wrapper && event.target.checkValidity()) wrapper.classList.remove('is-invalid');
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var invalid = markInvalidFields();
      if (invalid) {
        setStatus('Merci de compléter les champs obligatoires.', 'error');
        invalid.focus();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = 'Envoi en cours…';
      }
      setStatus('', '');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          if (!response.ok || data.ok === false) throw new Error(data.message || 'Erreur d’envoi');
          return data;
        });
      })
      .then(function () {
        form.reset();
        setStatus('Merci. Votre demande a bien été envoyée.', 'success');
      })
      .catch(function () {
        setStatus('L’envoi n’a pas pu être confirmé. Appelez le 079 521 86 84 ou écrivez à olchauffage@gmail.com.', 'error');
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || 'Envoyer ma demande';
        }
      });
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
