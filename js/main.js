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
  async function fetchHeroSlides() {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) { console.error('Failed to load hero slides:', error); return [] }
    return data || []
  }

  async function fetchStoryImages() {
    const { data, error } = await supabase
      .from('story_images')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) { console.error('Failed to load story images:', error); return [] }
    return data || []
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) { console.error('Failed to load categories:', error); return [] }
    return data || []
  }

  async function fetchMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id', { ascending: true })
    if (error) { console.error('Failed to load menu items:', error); return [] }
    return data || []
  }

  async function fetchAddresses() {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .order('is_primary', { ascending: false })
      .order('id', { ascending: true })
    if (error) { console.error('Failed to load addresses:', error); return [] }
    return data || []
  }

  async function fetchMenuCards() {
    const { data, error } = await supabase
      .from('menu_cards')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) { console.error('Failed to load menu cards:', error); return [] }
    return data || []
  }

  async function fetchApprovedReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(6)
    if (error) { console.error('Failed to load reviews:', error); return [] }
    return data || []
  }

  async function fetchAndRenderAll() {
    const [heroSlides, storyImages, categories, menuItems, addresses, menuCards, reviews] = await Promise.all([
      fetchHeroSlides(),
      fetchStoryImages(),
      fetchCategories(),
      fetchMenuItems(),
      fetchAddresses(),
      fetchMenuCards(),
      fetchApprovedReviews()
    ])

    renderHeroSlides(heroSlides)
    renderStoryGallery(storyImages)
    renderCategoryCards(categories, menuItems)
    renderMenuCards(menuCards)
    renderAddressCards(addresses)
    renderReviews(reviews)
    initReviewForm()
    dataLoaded = true
    menuRenderResolve()
  }

  /* =============================
     RENDER HERO SLIDER
  ============================= */
  let heroSlideData = []
  let currentHeroSlide = 0
  let heroTimer

  function renderHeroSlides(slides) {
    heroSlideData = slides
    const slider = document.getElementById('hero-slider')
    const dotsContainer = document.getElementById('hero-dots')
    const slideLabel = document.getElementById('hero-slide-label')
    if (!slider) return

    slider.innerHTML = slides.map(slide => `
      <div class="hero-bg-slide${slide.sort_order === 1 ? ' active' : ''}" data-name="${slide.name}">
        <img src="${slide.image_url || 'assets/images/hero bg/labaanwala logo.jpeg'}" alt="${slide.name}" class="hero-slide-img"
          onerror="this.src='assets/images/hero bg/labaanwala logo.jpeg'">
      </div>
    `).join('')

    if (dotsContainer) {
      dotsContainer.innerHTML = slides.map((s, i) => `
        <button class="hero-slide-dot${i === 0 ? ' active' : ''}" aria-label="Go to slide ${i + 1}"></button>
      `).join('')

      dotsContainer.querySelectorAll('.hero-slide-dot').forEach((dot, i) => {
        dot.addEventListener('click', () => goToHeroSlide(i))
      })
    }

    if (slideLabel && slides.length > 0) {
      slideLabel.textContent = slides[0]?.name || ''
    }

    const firstImg = slider.querySelector('.hero-bg-slide.active .hero-slide-img')
    if (firstImg) {
      requestAnimationFrame(() => {
        firstImg.style.opacity = '1'
        firstImg.style.transform = 'scale(1)'
      })
    }

    if (slides.length > 1) {
      startHeroTimer()
      const showcase = document.getElementById('hero-showcase')
      if (showcase) {
        showcase.addEventListener('mouseenter', stopHeroTimer)
        showcase.addEventListener('mouseleave', startHeroTimer)
      }
    }
  }

  function goToHeroSlide(index) {
    if (currentHeroSlide === index) return
    const slides = document.querySelectorAll('.hero-bg-slide')
    const dots = document.querySelectorAll('.hero-slide-dot')
    const slideLabel = document.getElementById('hero-slide-label')
    if (!slides.length) return

    const currentImg = slides[currentHeroSlide]?.querySelector('.hero-slide-img')
    if (currentImg) {
      currentImg.style.opacity = '0'
      currentImg.style.transform = 'scale(0.5)'
    }
    slides[currentHeroSlide]?.classList.remove('active')
    dots[currentHeroSlide]?.classList.remove('active')

    currentHeroSlide = index
    slides[currentHeroSlide]?.classList.add('active')
    dots[currentHeroSlide]?.classList.add('active')

    if (slideLabel) {
      slideLabel.textContent = heroSlideData[currentHeroSlide]?.name || ''
    }

    const nextImg = slides[currentHeroSlide]?.querySelector('.hero-slide-img')
    if (nextImg) {
      requestAnimationFrame(() => {
        nextImg.style.opacity = '1'
        nextImg.style.transform = 'scale(1)'
      })
    }
  }

  function advanceHeroSlide() {
    if (heroSlideData.length === 0) return
    const next = (currentHeroSlide + 1) % heroSlideData.length
    goToHeroSlide(next)
  }

  function startHeroTimer() {
    stopHeroTimer()
    heroTimer = setInterval(advanceHeroSlide, 3000)
  }

  function stopHeroTimer() {
    if (heroTimer) clearInterval(heroTimer)
  }

  /* =============================
     RENDER STORY GALLERY
  ============================= */
  function renderStoryGallery(images) {
    const wrap = document.getElementById('story-image-wrap')
    if (!wrap) return

    if (images.length === 0) return

    if (images.length === 1) {
      wrap.innerHTML = `<img src="${images[0].image_url}" alt="Labaanwala Dessert Lounge" class="story-img" loading="lazy">`
      return
    }

    wrap.innerHTML = `
      <div class="story-gallery">
        <div class="story-gallery-track" id="story-gallery-track">
          ${images.map(img => `
            <div class="story-gallery-slide">
              <img src="${img.image_url}" alt="Labaanwala" loading="lazy">
            </div>
          `).join('')}
        </div>
        <button class="story-gallery-btn story-gallery-prev" id="story-gallery-prev" aria-label="Previous">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button class="story-gallery-btn story-gallery-next" id="story-gallery-next" aria-label="Next">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
        <div class="story-gallery-dots" id="story-gallery-dots">
          ${images.map((_, i) => `<button class="story-gallery-dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>`).join('')}
        </div>
      </div>
    `

    let currentStoryIndex = 0
    const track = document.getElementById('story-gallery-track')
    const dots = document.querySelectorAll('.story-gallery-dot')
    const prevBtn = document.getElementById('story-gallery-prev')
    const nextBtn = document.getElementById('story-gallery-next')

    function goToStorySlide(index) {
      if (!track) return
      currentStoryIndex = index
      track.style.transform = `translateX(-${index * 100}%)`
      dots.forEach((d, i) => d.classList.toggle('active', i === index))
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => goToStorySlide(Number(dot.dataset.index)))
    })

    if (prevBtn) prevBtn.addEventListener('click', () => {
      goToStorySlide((currentStoryIndex - 1 + images.length) % images.length)
    })

    if (nextBtn) nextBtn.addEventListener('click', () => {
      goToStorySlide((currentStoryIndex + 1) % images.length)
    })
  }

  /* =============================
     RENDER CATEGORY CARDS
  ============================= */
  const categoryImages = new Map()

  function itemMatchesCategory(item, category) {
    if (!item || !category) return false

    if (item.category_id != null && category.id != null && Number(item.category_id) === Number(category.id)) {
      return true
    }

    const itemCategoryName = String(item.category || '').trim().toLowerCase()
    const categoryName = String(category.name || '').trim().toLowerCase()
    return itemCategoryName !== '' && itemCategoryName === categoryName
  }

  function renderCategoryCards(categories, items) {
    const grid = document.getElementById('category-grid')
    if (!grid) return

    if (categories.length === 0) {
      grid.innerHTML = '<p class="products-desc" style="grid-column:1/-1">No categories available yet.</p>'
      return
    }

    grid.innerHTML = categories.map(cat => {
      const catItems = items.filter(i => itemMatchesCategory(i, cat))
      const slides = catItems.filter(i => i.image_url)
      categoryImages.set(cat.id, slides.map(item => item.image_url))

      if (slides.length === 0) {
        return `
          <div class="category-card-item" data-category-id="${cat.id}">
            <div class="category-card-item-header">
              <h3 class="category-card-item-name">${cat.name}</h3>
            </div>
            <div class="category-card-item-body">
              <p class="category-card-item-empty">Menu items coming soon</p>
            </div>
          </div>
        `
      }

      return `
        <div class="category-card-item" data-category-id="${cat.id}">
          <div class="category-card-item-header">
            <h3 class="category-card-item-name">${cat.name}</h3>
            <span class="category-card-item-count">${catItems.length} item${catItems.length > 1 ? 's' : ''}</span>
          </div>
          <div class="category-card-slider">
            <div class="category-slider-track">
              ${slides.map(item => `
                <div class="category-slide">
                  <img src="${item.image_url}" alt="${item.name}" loading="lazy">
                  <div class="hero-slide-label category-slide-label">${item.name}</div>
                </div>
              `).join('')}
            </div>
            ${slides.length > 1 ? `
            <button class="category-slider-btn category-slider-prev" aria-label="Previous">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="category-slider-btn category-slider-next" aria-label="Next">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <div class="category-slider-dots">
              ${slides.map((_, i) => `<button class="category-slider-dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>`).join('')}
            </div>
            ` : ''}
          </div>
          
        </div>
      `
    }).join('')

    initCategorySliders()
  }

  function initCategorySliders() {
    document.querySelectorAll('.category-card-item').forEach(card => {
      const catId = Number(card.dataset.categoryId)
      const images = categoryImages.get(catId) || []
      if (images.length < 2) return
      const sliderEl = card.querySelector('.category-card-slider')
      if (!sliderEl) return

      const track = sliderEl.querySelector('.category-slider-track')
      const dots = sliderEl.querySelectorAll('.category-slider-dot')
      const prevBtn = sliderEl.querySelector('.category-slider-prev')
      const nextBtn = sliderEl.querySelector('.category-slider-next')
      let currentIndex = 0
      let autoTimer

      function goToSlide(index) {
        currentIndex = index
        track.style.transform = `translateX(-${index * 100}%)`
        dots.forEach((d, i) => d.classList.toggle('active', i === index))
      }

      function advance() {
        goToSlide((currentIndex + 1) % images.length)
      }

      function startAuto() {
        stopAuto()
        autoTimer = setInterval(advance, 4000)
      }

      function stopAuto() {
        if (autoTimer) clearInterval(autoTimer)
      }

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          goToSlide(Number(dot.dataset.index))
          startAuto()
        })
      })

      if (prevBtn) prevBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        goToSlide((currentIndex - 1 + images.length) % images.length)
        startAuto()
      })

      if (nextBtn) nextBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        goToSlide((currentIndex + 1) % images.length)
        startAuto()
      })

      card.addEventListener('mouseenter', stopAuto)
      card.addEventListener('mouseleave', startAuto)

      startAuto()
    })
  }

  /* =============================
     RENDER MENU CARDS
  ============================= */
  function renderMenuCards(cards) {
    const section = document.getElementById('menu-cards-section')
    const grid = document.getElementById('menu-cards-grid')
    if (!section || !grid) return

    if (cards.length === 0) {
      section.style.display = 'none'
      return
    }

    section.style.display = ''

    grid.innerHTML = cards.map(card => `
      <div class="menu-image-card">
        <img src="${card.image_url}" alt="${card.title}" class="menu-card-img" loading="lazy"
             onerror="this.closest('.menu-image-card')?.classList.add('card-hidden')">
        <div class="menu-image-overlay">
          <i class="fa-solid fa-magnifying-glass-plus"></i>
          <span>View Full Menu</span>
        </div>
      </div>
    `).join('')
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

  function extractCoordinates(embedUrl) {
    if (!embedUrl) return null
    const match = embedUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
    if (match) return `${match[1]},${match[2]}`
    const qMatch = embedUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (qMatch) return `${qMatch[1]},${qMatch[2]}`
    return null
  }

  function openAddressModal(addr) {
    if (!addressModal || !addressModalBody) return

    const mapHtml = addr.map_embed_url
      ? `<div class="address-modal-map"><iframe src="${addr.map_embed_url}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" title="${addr.name} Map"></iframe></div>`
      : ''

    const coords = extractCoordinates(addr.map_embed_url)
    const directionsHref = coords
      ? `https://www.google.com/maps/dir/?api=1&destination=${coords}`
      : addr.address_text
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
     RENDER REVIEWS
  ============================= */
  function renderReviews(reviews) {
    const grid = document.getElementById('reviews-grid')
    if (!grid) return

    if (reviews.length === 0) {
      grid.innerHTML = '<p class="review-empty">No reviews yet. Be the first to share your experience!</p>'
      return
    }

    grid.innerHTML = reviews.map(review => {
      const initial = review.customer_name.charAt(0).toUpperCase()
      const stars = Array(review.rating).fill('<i class="fa-solid fa-star"></i>').join('')
      const date = new Date(review.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

      return `
        <div class="review-card">
          <div class="review-card-header">
            <div class="review-avatar">${initial}</div>
            <div class="review-author-info">
              <span class="review-author-name">${review.customer_name}</span>
              <span class="review-date">${date}</span>
            </div>
          </div>
          <div class="review-stars">${stars}</div>
          <p class="review-text">"${review.comment}"</p>
        </div>
      `
    }).join('')
  }

  /* =============================
     REVIEW FORM
  ============================= */
  let selectedRating = 0

  function initReviewForm() {
    const form = document.getElementById('review-form')
    const ratingStars = document.querySelectorAll('.rating-star')
    const messageEl = document.getElementById('review-form-message')
    const submitBtn = document.getElementById('review-submit-btn')

    if (!form) return

    ratingStars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = Number(star.dataset.rating)
        updateStarDisplay()
      })

      star.addEventListener('mouseenter', () => {
        const rating = Number(star.dataset.rating)
        ratingStars.forEach((s, i) => {
          s.style.color = i < rating ? '#F59E0B' : '#D1D5DB'
        })
      })

      star.addEventListener('mouseleave', () => {
        updateStarDisplay()
      })
    })

    function updateStarDisplay() {
      ratingStars.forEach((s, i) => {
        s.classList.toggle('active', i < selectedRating)
        s.style.color = i < selectedRating ? '#F59E0B' : '#D1D5DB'
      })
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const name = document.getElementById('review-name').value.trim()
      const comment = document.getElementById('review-comment').value.trim()

      if (!name || !comment) {
        showMessage('Please fill in all fields.', 'error')
        return
      }

      if (selectedRating === 0) {
        showMessage('Please select a rating.', 'error')
        return
      }

      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...'

      const { error } = await supabase.from('reviews').insert([
        {
          customer_name: name,
          rating: selectedRating,
          comment: comment
        }
      ])

      submitBtn.disabled = false
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Review'

      if (error) {
        showMessage('Something went wrong. Please try again.', 'error')
        console.error('Review submission error:', error)
        return
      }

      form.reset()
      selectedRating = 0
      updateStarDisplay()
      showMessage('Thank you! Your review has been submitted and will appear after approval.', 'success')
    })

    function showMessage(text, type) {
      if (!messageEl) return
      messageEl.textContent = text
      messageEl.className = 'review-form-message ' + type
      setTimeout(() => {
        messageEl.textContent = ''
        messageEl.className = 'review-form-message'
      }, 5000)
    }
  }
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

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

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
    if (navMenu.classList.contains('active')) closeMenu()
    else openMenu()
  });

  navOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

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
