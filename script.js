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

  // Slider des réalisations
  // Les images sont détectées automatiquement dans /photos-realisations/ via liste.php.
  var fieldSlider = document.getElementById('fieldSlider');
  if (fieldSlider) {
    var sliderTrack = fieldSlider.querySelector('.field-slider__track');
    var sliderDotsWrap = fieldSlider.querySelector('.field-slider__dots');
    var sliderPrev = fieldSlider.querySelector('.field-slider__arrow--prev');
    var sliderNext = fieldSlider.querySelector('.field-slider__arrow--next');
    var sliderCurrent = document.getElementById('fieldSliderCurrent');
    var sliderTotal = document.getElementById('fieldSliderTotal');

    var knownAlts = {
      '01-equipe-intervention.webp': 'Techniciens OL Chauffage devant un véhicule d’intervention',
      '02-sanitaire-intervention.webp': 'Technicien OL Chauffage intervenant sur une installation sanitaire',
      '03-chauffage-au-sol.webp': 'Installation de chauffage au sol sur un chantier',
      '04-installation-sanitaire.webp': 'Installation sanitaire encastrée avec bâti-support et raccordements',
      '05-raccordements-sanitaire.webp': 'Raccordements sanitaires préparés dans une construction neuve'
    };

    function photoAlt(filename) {
      if (knownAlts[filename]) return knownAlts[filename];
      var label = filename
        .replace(/\.[^.]+$/, '')
        .replace(/^\d+[\s._-]*/, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return label ? 'Réalisation OL Chauffage Sanitaire — ' + label : 'Réalisation OL Chauffage Sanitaire';
    }

    function renderPhotos(files) {
      if (!sliderTrack || !sliderDotsWrap || !Array.isArray(files) || !files.length) return;

      sliderTrack.innerHTML = '';
      sliderDotsWrap.innerHTML = '';

      files.forEach(function (filename, index) {
        var figure = document.createElement('figure');
        figure.className = 'field-slider__slide' + (index === 0 ? ' is-active' : '');
        figure.setAttribute('data-slide', String(index));
        figure.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');

        var img = document.createElement('img');
        img.src = 'photos-realisations/' + encodeURIComponent(filename);
        img.alt = photoAlt(filename);
        img.decoding = 'async';
        if (index > 0) img.loading = 'lazy';
        figure.appendChild(img);
        sliderTrack.appendChild(figure);

        var dot = document.createElement('button');
        dot.className = 'field-slider__dot' + (index === 0 ? ' is-active' : '');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        dot.setAttribute('aria-label', 'Voir la réalisation ' + (index + 1));
        dot.setAttribute('data-slide-to', String(index));
        dot.setAttribute('tabindex', index === 0 ? '0' : '-1');
        sliderDotsWrap.appendChild(dot);
      });
    }

    function initFieldSlider() {
      var sliderSlides = Array.prototype.slice.call(fieldSlider.querySelectorAll('.field-slider__slide'));
      var sliderDots = Array.prototype.slice.call(fieldSlider.querySelectorAll('.field-slider__dot'));
      var sliderIndex = 0;
      var sliderTimer = null;
      var pointerStartX = null;
      var pointerDeltaX = 0;

      if (sliderTotal) sliderTotal.textContent = String(sliderSlides.length);
      if (sliderCurrent) sliderCurrent.textContent = sliderSlides.length ? '1' : '0';

      if (sliderPrev) sliderPrev.hidden = sliderSlides.length < 2;
      if (sliderNext) sliderNext.hidden = sliderSlides.length < 2;
      if (sliderDotsWrap) sliderDotsWrap.hidden = sliderSlides.length < 2;

      function showSlide(index, userAction) {
        if (!sliderSlides.length) return;
        sliderIndex = (index + sliderSlides.length) % sliderSlides.length;
        sliderTrack.style.transform = 'translate3d(-' + (sliderIndex * 100) + '%, 0, 0)';

        sliderSlides.forEach(function (slide, i) {
          var active = i === sliderIndex;
          slide.classList.toggle('is-active', active);
          slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        });

        sliderDots.forEach(function (dot, i) {
          var active = i === sliderIndex;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-selected', active ? 'true' : 'false');
          dot.setAttribute('tabindex', active ? '0' : '-1');
        });

        if (sliderCurrent) sliderCurrent.textContent = String(sliderIndex + 1);
        if (userAction) restartSliderTimer();
      }

      function nextSlide(userAction) { showSlide(sliderIndex + 1, userAction); }
      function prevSlide(userAction) { showSlide(sliderIndex - 1, userAction); }

      function stopSliderTimer() {
        if (sliderTimer) {
          window.clearInterval(sliderTimer);
          sliderTimer = null;
        }
      }

      function startSliderTimer() {
        if (reducedMotion || sliderSlides.length < 2 || sliderTimer) return;
        sliderTimer = window.setInterval(function () { nextSlide(false); }, 5500);
      }

      function restartSliderTimer() {
        stopSliderTimer();
        startSliderTimer();
      }

      if (sliderPrev) sliderPrev.addEventListener('click', function () { prevSlide(true); });
      if (sliderNext) sliderNext.addEventListener('click', function () { nextSlide(true); });

      sliderDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          showSlide(Number(dot.getAttribute('data-slide-to')) || 0, true);
        });
      });

      fieldSlider.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          prevSlide(true);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          nextSlide(true);
        }
      });

      fieldSlider.addEventListener('pointerdown', function (event) {
        if (event.pointerType === 'mouse') return;
        pointerStartX = event.clientX;
        pointerDeltaX = 0;
      }, { passive: true });

      fieldSlider.addEventListener('pointermove', function (event) {
        if (pointerStartX === null) return;
        pointerDeltaX = event.clientX - pointerStartX;
      }, { passive: true });

      fieldSlider.addEventListener('pointerup', function () {
        if (pointerStartX === null) return;
        if (Math.abs(pointerDeltaX) > 48) {
          if (pointerDeltaX < 0) nextSlide(true);
          else prevSlide(true);
        }
        pointerStartX = null;
        pointerDeltaX = 0;
      });

      fieldSlider.addEventListener('pointercancel', function () {
        pointerStartX = null;
        pointerDeltaX = 0;
      });

      fieldSlider.addEventListener('mouseenter', stopSliderTimer);
      fieldSlider.addEventListener('mouseleave', startSliderTimer);
      fieldSlider.addEventListener('focusin', stopSliderTimer);
      fieldSlider.addEventListener('focusout', function (event) {
        if (!fieldSlider.contains(event.relatedTarget)) startSliderTimer();
      });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stopSliderTimer();
        else startSliderTimer();
      });

      showSlide(0, false);
      startSliderTimer();
    }

    // Sur le serveur, le slider se met à jour automatiquement en fonction des fichiers du dossier.
    fetch('photos-realisations/liste.php', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Liste des réalisations indisponible');
        return response.json();
      })
      .then(function (data) {
        if (data && Array.isArray(data.photos) && data.photos.length) renderPhotos(data.photos);
      })
      .catch(function () {
        // En aperçu local sans PHP, les 5 photos présentes dans le HTML restent utilisables.
      })
      .then(initFieldSlider);
  }

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
