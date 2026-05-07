// main.js - All JavaScript extracted from index.html
// Requirements: 6.1, 6.2, 6.3, 5.2

/**
 * Smoothly scrolls to a section by its ID.
 * @param {string} sectionId - The ID of the target section
 */
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Toggles the mobile navigation menu open/closed.
 * Updates aria-expanded and body scroll lock.
 */
function toggleNav() {
  const navLinks = document.querySelector('.nav-links');
  const toggle = document.querySelector('.nav-toggle');

  navLinks.classList.toggle('active');
  toggle.classList.toggle('active');

  // Update aria-expanded for accessibility
  const expanded = navLinks.classList.contains('active');
  toggle.setAttribute('aria-expanded', String(expanded));

  // Toggle scroll lock on body
  document.body.classList.toggle('nav-open', expanded);
}

/**
 * Navigates to a project detail page.
 * @param {string} projectId - The project identifier
 */
function openProject(projectId) {
  const projectUrls = {
    'pametna-kuca-austrija': '/projects/pametna-kuca.html',
    'sinsay-virovitica': '/projects/sinsay-virovitica.html',
    'hotel-hilton-ugljan': '/projects/hotel-hilton-ugljan.html',
    'obiteljska-kuca-babina-greda': '/projects/obiteljska-kuca-babina-greda.html',
    'falkensteiner-resort': '/projects/falkensteiner-resort.html',
    'smw-slavonski-brod': '/projects/smw-slavonski-brod.html'
  };

  if (projectUrls[projectId]) {
    window.location.href = projectUrls[projectId];
  } else {
    alert('Detalji za projekt "' + projectId + '" će biti dostupni uskoro!');
  }
}

/**
 * Handles contact form submission via Formspree.
 * @param {Event} e - The submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const statusMessage = document.getElementById('form-status');
  const submitBtn = form.querySelector('.submit-btn');

  statusMessage.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Slanje...';

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      statusMessage.textContent = '✅ Poruka je uspješno poslana!';
      statusMessage.className = 'success';
      statusMessage.style.display = 'block';
      form.reset();
    } else {
      statusMessage.textContent = '❌ Došlo je do greške. Pokušajte ponovo.';
      statusMessage.className = 'error';
      statusMessage.style.display = 'block';
    }
  } catch (error) {
    statusMessage.textContent = '⚠️ Greška s mrežom. Pokušajte kasnije.';
    statusMessage.className = 'error';
    statusMessage.style.display = 'block';
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Pošalji';
}

// --- Initialization functions ---

/**
 * Sets up navigation event listeners:
 * - Nav toggle (hamburger) click
 * - Nav link clicks (close menu on mobile)
 */
function initNavigation() {
  // Nav toggle button
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', toggleNav);
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      const navLinks = document.querySelector('.nav-links');
      const navToggle = document.querySelector('.nav-toggle');

      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });

  // CTA button
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', function () {
      scrollToSection('services');
    });
  }
}

/**
 * Sets up gallery item click handlers using data-project attributes.
 * Also handles "view details" buttons inside gallery items.
 */
function initGallery() {
  document.querySelectorAll('.gallery-item[data-project]').forEach(function (item) {
    item.addEventListener('click', function () {
      openProject(this.getAttribute('data-project'));
    });
  });

  document.querySelectorAll('.view-details-btn[data-project]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openProject(this.getAttribute('data-project'));
    });
  });
}

/**
 * Animates gallery items on page load with staggered fade-in.
 */
function initGalleryAnimations() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(function (item, index) {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';

    setTimeout(function () {
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

/**
 * Sets up scroll spy to highlight active nav link based on scroll position.
 */
function initScrollSpy() {
  window.addEventListener('scroll', function () {
    var sections = document.querySelectorAll('section');
    var navLinks = document.querySelectorAll('.nav-links a');

    var current = '';
    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * Sets up IntersectionObserver for service card animations.
 */
function initServiceCardObserver() {
  var cards = document.querySelectorAll('.service-card');
  if (cards.length === 0) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(function (card) {
    observer.observe(card);
  });
}

/**
 * Sets up the contact form submit handler.
 */
function initContactForm() {
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

/**
 * Sets the current year in the footer copyright element.
 */
function initCurrentYear() {
  var yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// --- Image Modal (Project Pages) ---

/**
 * Opens the image modal with the given image source.
 * @param {string} imageSrc - The URL of the image to display
 */
function openModal(imageSrc) {
  var modal = document.getElementById('imageModal');
  var modalImg = document.getElementById('modalImage');
  if (modal && modalImg) {
    modal.style.display = 'block';
    modalImg.src = imageSrc;
  }
}

/**
 * Closes the image modal.
 */
function closeModal() {
  var modal = document.getElementById('imageModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Initializes image modal functionality on project pages.
 * Binds click events to project images and modal close/backdrop.
 */
function initImageModal() {
  var modal = document.getElementById('imageModal');
  if (!modal) return;

  // Close button
  var closeBtn = modal.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Click on backdrop to close
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Bind project images
  document.querySelectorAll('.project-image').forEach(function (img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
      openModal(this.src);
    });
  });
}

// --- Main initialization ---

document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initGallery();
  initGalleryAnimations();
  initScrollSpy();
  initServiceCardObserver();
  initContactForm();
  initCurrentYear();
  initImageModal();
});
