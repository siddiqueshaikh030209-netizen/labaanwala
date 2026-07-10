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
    document.body.style.overflow = 'hidden'
  }

  function closeAddressModal() {
    if (addressModal) {
      addressModal.classList.remove('active')
      document.body.style.overflow = ''
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
     PRELOADER
  ============================= */
  const loaderProgress = document.getElementById('preloader-number');
  const preloader = document.getElementById('preloader');

  fetchAndRenderAll()

  if (preloader && loaderProgress) {
    document.body.classList.add('loading');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (progress > 100) progress = 100;
      loaderProgress.textContent = progress;
      if (progress >= 100) {
        clearInterval(interval);
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.classList.remove('loading');
        }, 500);
      }
    }, 40);
  }

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
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
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
      requestAnimationFrame(() => {
        firstImg.style.opacity = '1';
        firstImg.style.transform = 'scale(1)';
      });
    }
  }

  function goToSlide(index) {
    if (currentHeroSlide === index) return;

    const currentImg = heroSlides[currentHeroSlide].querySelector('.hero-slide-img');
    if (currentImg) {
      currentImg.style.opacity = '0';
      currentImg.style.transform = 'scale(0.5)';
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
      requestAnimationFrame(() => {
        nextImg.style.opacity = '1';
        nextImg.style.transform = 'scale(1)';
      });
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
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
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
