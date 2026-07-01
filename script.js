document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Smooth scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Navbar behavior ---------- */
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;
  const navbarScrollHandler = () => {
    const curY = window.scrollY;
    // shrink & blur after 80px
    if (curY > 80) {
      navbar.classList.add('shrink', 'backdrop-blur');
    } else {
      navbar.classList.remove('shrink', 'backdrop-blur');
    }
    // hide on scroll down, show on scroll up
    if (curY > lastScrollY && curY > 100) {
      navbar.classList.add('hide');
    } else {
      navbar.classList.remove('hide');
    }
    lastScrollY = curY;
  };
  window.addEventListener('scroll', navbarScrollHandler);

  /* ---------- Hamburger menu toggle ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.navbar nav ul');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  }

  /* ---------- Reveal on scroll with stagger ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const index = Array.from(revealElements).indexOf(el);
        setTimeout(() => el.classList.add('visible'), index * 100);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- Stat counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 2000;
        const start = performance.now();
        const step = now => {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  statNumbers.forEach(el => counterObserver.observe(el));

  /* ---------- Gallery Lightbox ---------- */
  const galleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));
  if (galleryImages.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <button class="lightbox-close">&times;</button>
      <button class="lightbox-prev">&#10094;</button>
      <img class="lightbox-img" src="" alt="">
      <button class="lightbox-next">&#10095;</button>
    `;
    document.body.appendChild(overlay);
    const imgEl = overlay.querySelector('.lightbox-img');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');
    let currentIdx = 0;

    const openLightbox = idx => {
      currentIdx = idx;
      imgEl.src = galleryImages[currentIdx].src;
      overlay.classList.add('open');
    };
    const closeLightbox = () => overlay.classList.remove('open');
    const showPrev = () => {
      currentIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length;
      imgEl.src = galleryImages[currentIdx].src;
    };
    const showNext = () => {
      currentIdx = (currentIdx + 1) % galleryImages.length;
      imgEl.src = galleryImages[currentIdx].src;
    };

    galleryImages.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    });
  }

  /* ---------- Form validation & success message ---------- */
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.textContent = 'Kiitos! Viestisi on lähetetty.';
    successMessage.style.opacity = '0';
    successMessage.style.transition = 'opacity 0.5s';
    contactForm.parentNode.appendChild(successMessage);

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const missing = [...contactForm.elements].some(el => el.required && !formData.get(el.name));
      if (missing) {
        // let HTML5 validation handle UI
        contactForm.reportValidity();
        return;
      }
      // Simple email pattern check
      const email = formData.get('sahkoposti');
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) {
        alert('Syötä kelvollinen sähköpostiosoite.');
        return;
      }
      // Simulate successful submit
      successMessage.style.opacity = '1';
      setTimeout(() => {
        successMessage.style.opacity = '0';
      }, 3000);
      contactForm.reset();
    });
  }
});