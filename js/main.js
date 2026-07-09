document.addEventListener('DOMContentLoaded', () => {

  /* =============================
     SUPABASE CLIENT
  ============================= */
  const supabaseUrl = 'https://lcxiruybhhvbyrvugzsr.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeGlydXliaGh2YnlydnVnenNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1ODk1MTIsImV4cCI6MjA5OTE2NTUxMn0.J0_b_GHA4Rm8UqiFXpIBwzyLcXaOiK0e-Qm4vMTEm7g'
  const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey)

  let dataLoaded = false
  let menuRenderResolve
  const menuRendered = new Promise(r => { menuRenderResolve = r })

  /* =============================
     DATA FETCHING
  ============================= */
  async function fetchMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Failed to load menu items:', error)
      return []
    }
    return data || []
  }

  async function fetchAddresses() {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .order('is_primary', { ascending: false })
      .order('id', { ascending: true })

    if (error) {
      console.error('Failed to load addresses:', error)
      return []
    }
    return data || []
  }

  async function fetchAndRenderAll() {
    const [menuItems, addresses] = await Promise.all([
      fetchMenuItems(),
      fetchAddresses()
    ])

    renderMenuCards(menuItems)
    renderAddressCards(addresses)
    dataLoaded = true
    menuRenderResolve()
    ScrollTrigger.refresh()
  }

  /* =============================
     RENDER MENU CARDS
  ============================= */
  function renderMenuCards(items) {
    const grid = document.getElementById('menu-grid')
    if (!grid) return

    grid.innerHTML = items.map(item => {
      const imgSrc = item.image_url || `assets/images/hero bg/${item.name}.jpeg`
      return `
        <div class="menu-card">
          <div class="menu-img-wrap">
            <img src="${imgSrc}" alt="${item.name}" class="menu-img" loading="lazy"
              onerror="this.src='assets/images/hero bg/labaanwala logo.jpeg'">
          </div>
          <div class="menu-details">
            <div class="menu-header">
              <h3 class="menu-card-title">${item.name}</h3>
              ${item.price ? `<span class="menu-price">₹${item.price}</span>` : ''}
            </div>
            <p class="menu-desc">${item.description}</p>
          </div>
        </div>
      `
    }).join('')
  }

  /* =============================
     RENDER ADDRESS CARDS
  ============================= */
  let currentAddressData = null

  function renderAddressCards(addresses) {
    const container = document.getElementById('address-cards')
    if (!container) return

    container.innerHTML = addresses.map(addr => `
      <button class="address-card" data-address-id="${addr.id}">
        <div class="address-card-icon">
          <i class="fa-solid fa-location-dot"></i>
        </div>
        <div class="address-card-info">
          <div class="address-card-name">
            ${addr.name}
            ${addr.is_primary ? '<span class="address-card-badge">Primary</span>' : ''}
          </div>
          <div class="address-card-phone">${addr.phone || 'Phone not available'}</div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color: var(--color-text-light); font-size: 0.85rem;"></i>
      </button>
    `).join('')

    currentAddressData = addresses

    container.querySelectorAll('.address-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.addressId)
        const addr = addresses.find(a => a.id === id)
        if (addr) openAddressModal(addr)
      })
    })
  }

  /* =============================
     ADDRESS MODAL
  ============================= */
  const addressModal = document.getElementById('address-modal')
  const addressModalBody = document.getElementById('address-modal-body')

  function openAddressModal(addr) {
    if (!addressModal || !addressModalBody) return

    const mapHtml = addr.map_embed_url
      ? `<div class="address-modal-map"><iframe src="${addr.map_embed_url}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" title="${addr.name} Map"></iframe></div>`
      : ''

    const directionsHref = addr.address_text
      ? `https://www.google.com/maps/search/${encodeURIComponent(addr.address_text)}`
      : '#'

    addressModalBody.innerHTML = `
      <h3 class="address-modal-name">${addr.name}</h3>
      ${addr.address_text ? `<p class="address-modal-text">${addr.address_text.replace(/\n/g, '<br>')}</p>` : ''}
      ${addr.phone ? `
        <div class="address-modal-phone-wrap">
          <i class="fa-solid fa-phone"></i>
          <a href="tel:${addr.phone}">${addr.phone}</a>
        </div>
      ` : ''}
      ${mapHtml}
      <div class="address-modal-actions">
        <a href="${directionsHref}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <i class="fa-solid fa-map-location-dot"></i> Get Directions
        </a>
        ${addr.phone ? `
          <a href="tel:${addr.phone}" class="btn btn-secondary">
            <i class="fa-solid fa-phone"></i> Call Now
          </a>
        ` : ''}
      </div>
    `

    addressModal.classList.add('active')
    lenis.stop()
  }

  function closeAddressModal() {
    if (addressModal) {
      addressModal.classList.remove('active')
      lenis.start()
    }
  }

  if (addressModal) {
    const closeBtn = addressModal.querySelector('.address-modal-close')
    if (closeBtn) closeBtn.addEventListener('click', closeAddressModal)
    addressModal.addEventListener('click', (e) => {
      if (e.target === addressModal) closeAddressModal()
    })
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (addressModal && addressModal.classList.contains('active')) {
        closeAddressModal()
        return
      }
      if (navMenu && navMenu.classList.contains('active')) {
        closeMenu()
      }
    }
  })

  /* =============================
     PRELOADER ANIMATION
  ============================= */
  const loaderProgress = document.getElementById('preloader-number');
  const preloader = document.getElementById('preloader');

  fetchAndRenderAll()

  if (preloader && loaderProgress) {
    document.body.classList.add('loading');

    gsap.to('.preloader-logo', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
    gsap.to('.preloader-progress-wrap', { opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 });

    let progress = { value: 0 };
    gsap.to(progress, {
      value: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        loaderProgress.textContent = Math.round(progress.value);
      },
      onComplete: () => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.8,
          onComplete: () => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
            startIntroAnimation();
          }
        });
      }
    });
  } else {
    setTimeout(startIntroAnimation, 500);
  }

  /* =============================
     LENIS SMOOTH SCROLL
  ============================= */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


  /* =============================
     HEADER & NAVIGATION
  ============================= */
  const header = document.querySelector('.header');
  const hamburger = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll-based header style
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Toggle mobile menu
  function openMenu() {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    navOverlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    lenis.stop();
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    lenis.start();
  }

  hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* =============================
     HERO SHOWCASE SLIDER
  ============================= */
  const heroSlides = document.querySelectorAll('.hero-bg-slide');
  const dotsContainer = document.getElementById('hero-dots');
  const slideLabel = document.getElementById('hero-slide-label');
  let currentHeroSlide = 0;
  let heroTimer;

  const dots = [];
  heroSlides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.classList.add('hero-slide-dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  if (heroSlides.length > 0) {
    const firstImg = heroSlides[0].querySelector('.hero-slide-img');
    if (firstImg) {
      gsap.to(firstImg, { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.7)', delay: 0.3 });
    }
  }

  function goToSlide(index) {
    if (currentHeroSlide === index) return;

    const currentImg = heroSlides[currentHeroSlide].querySelector('.hero-slide-img');
    if (currentImg) {
      gsap.to(currentImg, { opacity: 0, scale: 0.5, duration: 0.35, ease: 'power2.in' });
    }
    heroSlides[currentHeroSlide].classList.remove('active');
    if (dots[currentHeroSlide]) dots[currentHeroSlide].classList.remove('active');

    currentHeroSlide = index;
    heroSlides[currentHeroSlide].classList.add('active');
    if (dots[currentHeroSlide]) dots[currentHeroSlide].classList.add('active');

    if (slideLabel) {
      slideLabel.textContent = heroSlides[currentHeroSlide].dataset.name || '';
    }

    const nextImg = heroSlides[currentHeroSlide].querySelector('.hero-slide-img');
    if (nextImg) {
      gsap.fromTo(nextImg,
        { opacity: 0, scale: 0.55 },
        { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.7)', delay: 0.1 }
      );
    }
  }

  function advanceSlide() {
    const next = (currentHeroSlide + 1) % heroSlides.length;
    goToSlide(next);
  }

  function startHeroTimer() {
    heroTimer = setInterval(advanceSlide, 2500);
  }

  function stopHeroTimer() {
    clearInterval(heroTimer);
  }

  if (heroSlides.length > 1) {
    startHeroTimer();
    const showcase = document.getElementById('hero-showcase');
    if (showcase) {
      showcase.addEventListener('mouseenter', stopHeroTimer);
      showcase.addEventListener('mouseleave', startHeroTimer);
    }
  }


  /* =============================
     GSAP HERO INTRO ANIMATIONS
  ============================= */
  gsap.registerPlugin(ScrollTrigger);

  const introTimeline = gsap.timeline({ delay: 0.2 });

  function startIntroAnimation() {
    introTimeline
      .fromTo('.hero-main-logo',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
      )
      .to('#hero-eyebrow', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4')
      .to('.hero-title-word', {
        y: '0%',
        opacity: 1,
        duration: 1.0,
        stagger: 0.18,
        ease: 'power4.out',
      }, '-=0.4')
      .to('#hero-desc', {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
      }, '-=0.6')
      .to('#hero-ctas', {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
      }, '-=0.7');
  }


  /* =============================
     TEXT REVEAL UTILITIES
  ============================= */

  function splitWords(el) {
    if (el.dataset.splitDone) return el.querySelectorAll('.word-inner');
    el.dataset.splitDone = '1';
    const text = el.textContent.trim();
    el.innerHTML = text.split(/\s+/).map(w =>
      `<span class="word-outer"><span class="word-inner">${w}</span></span>`
    ).join(' ');
    return el.querySelectorAll('.word-inner');
  }

  function revealWords(el, options = {}) {
    const words = splitWords(el);
    gsap.fromTo(words,
      { y: '115%' },
      {
        y: '0%',
        duration: options.duration || 1.1,
        stagger: options.stagger || 0.08,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: options.trigger || el,
          start: options.start || 'top 88%',
          once: true,
        }
      }
    );
  }

  function revealLines(els, trigger, options = {}) {
    if (!els.length) return;
    gsap.fromTo(els,
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: options.duration || 0.9,
        stagger: options.stagger || 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trigger || els[0],
          start: options.start || 'top 85%',
          once: true,
        }
      }
    );
  }

  function revealClip(els, options = {}) {
    gsap.fromTo(els,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: options.duration || 0.9,
        stagger: options.stagger || 0.1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: options.trigger || els[0],
          start: options.start || 'top 88%',
          once: true,
        }
      }
    );
  }


  /* =============================
     SECTION SUBTITLES — Clip wipe
  ============================= */
  document.querySelectorAll('.section-subtitle').forEach(el => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.8,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });

  document.querySelectorAll('.story-title-sub').forEach(el => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.8,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });


  /* =============================
     SECTION TITLES — Word by word
  ============================= */
  document.querySelectorAll('.section-title').forEach(el => revealWords(el));
  document.querySelectorAll('.story-title').forEach(el =>
    revealWords(el, { trigger: el.closest('.story-content') || el, start: 'top 82%', stagger: 0.09 })
  );
  document.querySelectorAll('.visual-menu-title').forEach(el => revealWords(el));


  /* =============================
     STORY SECTION — Line by line
  ============================= */
  gsap.fromTo('.story-image-wrap',
    { opacity: 0, x: 60, scale: 0.97 },
    {
      opacity: 1, x: 0, scale: 1, duration: 1.3, ease: 'power3.out',
      scrollTrigger: { trigger: '.story-grid', start: 'top 78%', once: true }
    }
  );

  gsap.to('.story-img', {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.story',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });

  revealLines(
    document.querySelectorAll('.story-text'),
    document.querySelector('.story-content'),
    { stagger: 0.22, start: 'top 80%' }
  );
  revealLines(
    document.querySelectorAll('.story-textstrong'),
    document.querySelector('.story-content'),
    { duration: 1, start: 'top 78%' }
  );

  const storyCta = document.querySelector('#story-btn-explore');
  if (storyCta) {
    gsap.fromTo(storyCta,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: storyCta, start: 'top 90%', once: true }
      }
    );
  }


  /* =============================
     PRODUCTS SECTION
  ============================= */
  revealLines(
    document.querySelectorAll('.products-desc'),
    document.querySelector('.products-desc'),
    { start: 'top 88%' }
  );

  menuRendered.then(() => {
    const menuCards = document.querySelectorAll('.menu-card');
    if (menuCards.length) {
      gsap.fromTo(menuCards,
        { y: 70, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.85,
          stagger: { each: 0.09, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: { trigger: '.menu-grid', start: 'top 85%', once: true }
        }
      );
    }
  });

  const visualMenuHeader = document.querySelector('.visual-menu-header');
  if (visualMenuHeader) {
    gsap.fromTo(visualMenuHeader,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: visualMenuHeader, start: 'top 88%', once: true }
      }
    );
  }

  const menuImgCards = document.querySelectorAll('.menu-image-card');
  if (menuImgCards.length) {
    gsap.fromTo(menuImgCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: '.visual-menu-grid', start: 'top 85%', once: true }
      }
    );
  }


  /* =============================
     OUR NATURE SECTION
  ============================= */
  revealLines(
    document.querySelectorAll('.specialties-intro'),
    document.querySelector('.specialties-intro'),
    { start: 'top 90%' }
  );

  const specCards = gsap.utils.toArray('.specialty-card');
  if (specCards.length) {
    gsap.fromTo(specCards,
      { opacity: 0, y: 50, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.specialties-grid', start: 'top 90%', once: true }
      }
    );
  }

  document.querySelectorAll('.specialty-title').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -15 },
      {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      }
    );
  });

  document.querySelectorAll('.specialty-icon-wrap').forEach((el, i) => {
    gsap.fromTo(el,
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)',
        delay: i * 0.05,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      }
    );
  });


  /* =============================
     LOCATION SECTION
  ============================= */
  menuRendered.then(() => {
    const addressCards = document.querySelectorAll('.address-card');
    if (addressCards.length) {
      gsap.fromTo(addressCards,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.address-cards-grid', start: 'top 85%', once: true }
        }
      );
    }
  });


  /* =============================
     FOOTER — Storytelling fade
  ============================= */
  gsap.fromTo('.footer-brand',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer', start: 'top 90%', once: true }
    }
  );
  gsap.fromTo('.footer-grid > div:not(.footer-brand)',
    { opacity: 0, y: 25 },
    {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-grid', start: 'top 90%', once: true }
    }
  );


  /* =============================
     LIGHTBOX — MENU CARD IMAGES
  ============================= */
  const menuImageCards = document.querySelectorAll('.menu-image-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-btn-close');
  const lightboxPrev = document.getElementById('lightbox-btn-prev');
  const lightboxNext = document.getElementById('lightbox-btn-next');

  let menuImages = [];
  let currentImageIndex = 0;

  menuImageCards.forEach((card, index) => {
    const imgEl = card.querySelector('.menu-card-img');
    if (imgEl) {
      menuImages.push(imgEl.src);
      card.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
      });
    }
  });

  function openLightbox() {
    updateLightboxImage();
    if (lightbox) {
      lightbox.classList.add('active');
      lenis.stop();
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      lenis.start();
    }
  }

  function updateLightboxImage() {
    if (lightboxImg && menuImages.length > 0) {
      lightboxImg.src = menuImages[currentImageIndex];
    }
  }

  function showNextImage() {
    if (menuImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % menuImages.length;
    updateLightboxImage();
  }

  function showPrevImage() {
    if (menuImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + menuImages.length) % menuImages.length;
    updateLightboxImage();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  lightbox && lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });


  /* =============================
     ACTIVE NAV LINK HIGHLIGHT
  ============================= */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinkMap = {};
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      navLinkMap[href.slice(1)] = link;
    }
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.style.color = '');
        const activeLink = navLinkMap[entry.target.id];
        if (activeLink) {
          activeLink.style.color = 'var(--color-primary)';
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));

});
