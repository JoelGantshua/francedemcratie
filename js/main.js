// --- Supabase client (clé publishable côté client - visible publiquement) ---
const SUPABASE_URL = 'https://ystkygxtnpexxibflbat.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zgd82dC_FgpnBv4cM0ablw_MgptqTtf';

let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn('Supabase SDK non chargé.');
}

async function insertRow(table, payload) {
    if (!supabaseClient) {
        alert('Connexion Supabase indisponible.');
        return { error: new Error('Supabase non initialisé') };
    }
    const { error, data } = await supabaseClient.from(table).insert([payload]);
    return { error, data };
}

function bindFormInsert(formId, table, mapper, successMessage = 'Enregistré. Merci !') {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const payload = mapper(formData);
        const { error } = await insertRow(table, payload);
        if (error) {
            alert('Erreur: ' + (error.message || 'Envoi impossible'));
            return;
        }
        alert(successMessage);
        form.reset();
        form.querySelectorAll('button').forEach(b => b.disabled = false);
    });
}

// Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

function closeNavMenu() {
    navMenu?.classList.remove('active');
    navToggle?.classList.remove('active');
    document.body.classList.remove('menu-open');
    navToggle?.setAttribute('aria-expanded', 'false');
}

function openNavMenu() {
    navMenu?.classList.add('active');
    navToggle?.classList.add('active');
    document.body.classList.add('menu-open');
    navToggle?.setAttribute('aria-expanded', 'true');
}

if (navToggle && navMenu) {
    navToggle.setAttribute('role', 'button');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('active');
        if (isOpen) closeNavMenu(); else openNavMenu();
    });

    // Fermer au resize desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 769) closeNavMenu();
    });

    // Échap pour fermer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNavMenu();
    });
}

// Fermer le menu en cliquant sur un lien (sauf pour le toggle du dropdown)
// On cible uniquement les liens qui ne sont pas .dropdown-toggle
document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        // fermer les dropdowns ouverts sur mobile
        document.querySelectorAll('.has-dropdown.open').forEach(h => h.classList.remove('open'));
    });
});

// Dropdown toggle pour mobile : empêche le lien parent de naviguer et ouvre le sous-menu
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        const parent = this.parentElement;
        if (window.innerWidth < 768) {
            e.preventDefault();
            parent.classList.toggle('open');
        }
    });
});

// Données des actualités (à remplacer par une API)
const actualites = [
    {
        titre: "Meeting à Paris",
        date: "15 janvier 2024",
        description: "Grand meeting de campagne à Paris avec des milliers de supporters.",
        image: "images/meeting-paris.jpg"
    },
    {
        titre: "Présentation du programme économique",
        date: "10 janvier 2024",
        description: "Détails du plan économique pour relancer l'emploi et l'innovation.",
        image: "images/programme-economique.jpg"
    },
    {
        titre: "Tournée en région",
        date: "5 janvier 2024",
        description: "Rencontre avec les citoyens dans les territoires.",
        image: "images/tournee-region.jpg"
    }
];

// Charger les actualités
function chargerActualites() {
    const container = document.getElementById('news-container');
    if (!container) return; // Ne rien faire si le conteneur n'existe pas
    actualites.forEach(actu => {
        const article = document.createElement('article');
        article.className = 'news-card';
        article.innerHTML = `
            <img src="${actu.image}" alt="${actu.titre}" class="news-image" onerror="this.style.display='none'">
            <div class="news-content">
                <div class="news-date">${actu.date}</div>
                <h3>${actu.titre}</h3>
                <p>${actu.description}</p>
            </div>
        `;
        container.appendChild(article);
    });
}

// Formulaire d'engagement
// Gestion du formulaire d'engagement (inclut les champs "Déjà engagé")
const signupForm = document.getElementById('signup-form');
const dejaCheckbox = document.getElementById('deja-engage-checkbox');
const dejaFields = document.getElementById('deja-engage-fields');

if (dejaCheckbox && dejaFields) {
    dejaCheckbox.addEventListener('change', function() {
        if (this.checked) {
            dejaFields.style.display = 'block';
        } else {
            dejaFields.style.display = 'none';
            // clear fields when hidden
            dejaFields.querySelectorAll('input, textarea').forEach(i => i.value = '');
        }
    });
}

bindFormInsert('signup-form', 'engagements', (fd) => ({
    email: fd.get('email') || '',
    name: fd.get('name') || '',
    phone: fd.get('phone') || '',
    type: fd.get('type_engagement') || '',
    deja_engage: !!dejaCheckbox?.checked,
    role: fd.get('role') || '',
    organisation: fd.get('organisation') || '',
    depuis: fd.get('depuis') || '',
    message: fd.get('deja_message') || ''
}), "Merci - votre inscription est enregistrée. Nous vous recontacterons rapidement.");

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gestion du formulaire de contact (section #contact)
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
if (contactForm) {
    bindFormInsert('contact-form', 'contact_form', (fd) => ({
        name: fd.get('name') || '',
        email: fd.get('email') || '',
        phone: fd.get('phone') || '',
        message: fd.get('message') || ''
    }), 'Merci pour votre message ! Nous vous répondrons rapidement.');
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    chargerActualites();
    // IntersectionObserver pour les animations 'reveal'
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(r => io.observe(r));
    } else {
        // fallback: reveal all
        reveals.forEach(r => r.classList.add('in-view'));
    }

    // Animation d'entrée pour les cartes programme
    const cards = document.querySelectorAll('.programme-card');
    if ('IntersectionObserver' in window && cards.length) {
        const cardObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    cardObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        cards.forEach(c => cardObs.observe(c));
    } else {
        cards.forEach(c => c.classList.add('in-view'));
    }

    // Animation d'entrée pour le header
    const header = document.querySelector('.header');
    if (header) {
        setTimeout(() => {
            header.classList.add('in-view');
        }, 300);
    }

    // Unifier le footer sur toutes les pages
    const footer = document.querySelector('footer.footer');
    if (footer) {
        footer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Contact</h3>
                    <p><a href="mailto:Francedemocratie2@gmail.com">Francedemocratie2@gmail.com</a></p>
                    <p>Tél : 06 69 74 27 80</p>
                </div>
                <div class="footer-section">
                    <h3>Liens rapides</h3>
                    <div style="display:flex;gap:2rem;">
                        <ul style="list-style:none;padding:0;margin:0;flex:1;">
                            <li><a href="index.html">Accueil</a></li>
                            <li><a href="programme.html">Programme</a></li>
                            <li><a href="actualites.html">Actualités</a></li>
                            <li><a href="engagement.html">S'engager</a></li>
                            <li><a href="contact.html">Contact</a></li>
                        </ul>
                        <ul style="list-style:none;padding:0;margin:0;flex:1;">
                            <li><a href="politique-confidentialite.html">Confidentialité</a></li>
                            <li><a href="mentions-legales.html">Mentions légales</a></li>
                            <li><a href="sondage.html">Sondage</a></li>
                            <li><a href="soutenir-la-campagne.html">Soutenir la campagne</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Suivez-nous</h3>
                    <div class="social-links">
                        <a href="https://www.facebook.com/share/16EXm9CXxg/?mibextid=wwXIfr">Facebook</a>
                    </div>
                </div>
            </div>
        </div>
        <div style="text-align:center; margin-top:2rem; font-size:0.95rem; color:#ccc;">
            © 2025 Développé par <a href="https://marocgestionentrprendre.com" target="_blank" rel="noopener" style="color:#0055a4; text-decoration:underline;">Maroc Gestion Entreprendre</a>
        </div>
        `;
    }
});

// Volunteer form
bindFormInsert('volunteer-form', 'volunteers', (fd) => ({
    name: fd.get('name') || '',
    email: fd.get('email') || '',
    role: fd.get('role') || '',
    message: fd.get('message') || ''
}), "Merci pour votre engagement ! L'équipe vous contactera.");

// Newsletter forms (legislatives + actualites)
bindFormInsert('newsletter-form', 'newsletters', (fd) => ({
    email: fd.get('email') || fd.get('n-email') || '',
    postal: fd.get('postal') || fd.get('n-postal') || ''
}), "Inscription newsletter enregistrée.");

bindFormInsert('newsletter-form-actualites', 'newsletters', (fd) => ({
    email: fd.get('email') || '',
    postal: ''
}), "Inscription newsletter enregistrée.");

bindFormInsert('newsletter-form-home', 'newsletters', (fd) => ({
    email: fd.get('email') || '',
    postal: fd.get('postal') || ''
}), "Inscription newsletter enregistrée.");

// Sondage
bindFormInsert('surveyForm', 'surveys', (fd) => ({
    q1: fd.get('q1') || '',
    q2: fd.get('q2') || '',
    ts: new Date().toISOString()
}), "Merci ! Votre réponse a été prise en compte.");

(function () {
  const carousel = document.getElementById('media-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.slide'));
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  let active = 0;
  let interval = null;
  const delay = 4000;

  function renderDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.dataset.index = i;
      if (i === active) b.classList.add('active');
      b.addEventListener('click', () => goTo(i, true));
      dotsContainer.appendChild(b);
    });
  }

  function update() {
    slides.forEach((s, i) => s.classList.toggle('active', i === active));
    const dots = Array.from(dotsContainer.children);
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  }

  function next() { active = (active + 1) % slides.length; update(); }
  function prev() { active = (active - 1 + slides.length) % slides.length; update(); }
  function goTo(i, stopAuto = false) {
    active = i % slides.length;
    update();
    if (stopAuto) restartAuto();
  }

  function startAuto() {
    stopAuto();
    interval = setInterval(next, delay);
  }
  function stopAuto() { if (interval) { clearInterval(interval); interval = null; } }
  function restartAuto() { stopAuto(); startAuto(); }

  // Controls
  nextBtn.addEventListener('click', () => { next(); restartAuto(); });
  prevBtn.addEventListener('click', () => { prev(); restartAuto(); });

  // Pause on hover/focus
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  // Lightbox
  const lightbox = document.getElementById('media-lightbox');
  const lbContent = document.getElementById('lb-content');
  const lbClose = document.getElementById('lb-close');

  slides.forEach(s => {
    s.addEventListener('click', () => {
      const img = s.querySelector('img');
      if (!img) return;
      openLightbox(img.src, img.alt || '');
    });
  });

  function openLightbox(src, alt) {
    lbContent.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    lbContent.appendChild(img);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    stopAuto();
  }

  lbClose.addEventListener('click', () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbContent.innerHTML = '';
    startAuto();
  });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lbClose.click(); });

  // init
  renderDots();
  update();
  startAuto();
})();

document.addEventListener('DOMContentLoaded', function () {
  // Bind pour les media-item (ouvrir dans lightbox) — vidéo
  const lightbox = document.getElementById('media-lightbox');
  const lbContent = document.getElementById('lb-content');
  const lbClose = document.getElementById('lb-close');

  function openLightboxVideo(src, title) {
    if (!lightbox || !lbContent) return;
    lbContent.innerHTML = '';
    const v = document.createElement('video');
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.style.width = '100%';
    v.style.maxHeight = '80vh';
    v.setAttribute('playsinline', '');
    lbContent.appendChild(v);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  // lier tous les liens .media-item de type video
  document.querySelectorAll('.media-item[data-type="video"]').forEach(it => {
    it.addEventListener('click', function (e) {
      e.preventDefault();
      const href = it.getAttribute('href');
      openLightboxVideo(href, it.getAttribute('title') || '');
    });
  });

  if (lbClose) lbClose.addEventListener('click', function () {
    if (!lightbox || !lbContent) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbContent.innerHTML = '';
  });
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lbClose && lbClose.click(); });
});

// binding pour ouvrir les vidéos en lightbox depuis la section #accueil-videos
document.addEventListener('DOMContentLoaded', function () {
  const lb = document.getElementById('media-lightbox');
  const lbContent = document.getElementById('lb-content');
  const lbClose = document.getElementById('lb-close');

  function openVideoInLightbox(src) {
    if (!lb || !lbContent) return;
    lbContent.innerHTML = '';
    const v = document.createElement('video');
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.style.maxHeight = '85vh';
    v.style.width = '100%';
    v.playsInline = true;
    lbContent.appendChild(v);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }

  function closeLb() {
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    if (lbContent) lbContent.innerHTML = '';
  }

  // délégation click + accessibility (enter/space)
  const videosSection = document.getElementById('accueil-videos');
  if (videosSection) {
    videosSection.addEventListener('click', function (e) {
      const item = e.target.closest('.video-item');
      if (!item) return;
      const src = item.dataset.src;
      if (src) openVideoInLightbox(src);
    });
    videosSection.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const item = e.target.closest('.video-item');
        if (!item) return;
        e.preventDefault();
        const src = item.dataset-src || item.dataset.src;
        if (src) openVideoInLightbox(src);
      }
    });
  }

  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
});

document.addEventListener('DOMContentLoaded', function () {
  // ouverture PDF dans la lightbox
  const pdfGrid = document.getElementById('pdf-grid');
  const lightbox = document.getElementById('media-lightbox');
  const lbContent = document.getElementById('lb-content');
  const lbClose = document.getElementById('lb-close');

  function openPdf(url) {
    if (!lightbox || !lbContent) return;
    lbContent.innerHTML = '<iframe class="pdf-viewer" src="' + url + '"></iframe>';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLb() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lbContent) lbContent.innerHTML = '';
  }

  if (pdfGrid) {
    pdfGrid.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-pdf-open]');
      if (btn) {
        e.preventDefault();
        const parent = btn.closest('.pdf-item');
        const url = parent ? parent.dataset.pdf || btn.getAttribute('href') : btn.getAttribute('href');
        if (url) openPdf(url);
      }
    });
    // keyboard accessibility: Enter/Space on article opens reader
    pdfGrid.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const item = e.target.closest('.pdf-item');
        if (item) {
          e.preventDefault();
          const url = item.dataset.pdf;
          if (url) openPdf(url);
        }
      }
    });
  }

  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
});
