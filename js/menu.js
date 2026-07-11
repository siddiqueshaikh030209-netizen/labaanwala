document.addEventListener('DOMContentLoaded', () => {
  const supabaseUrl = 'https://lcxiruybhhvbyrvugzsr.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeGlydXliaGh2YnlydnVnenNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1ODk1MTIsImV4cCI6MjA5OTE2NTUxMn0.J0_b_GHA4Rm8UqiFXpIBwzyLcXaOiK0e-Qm4vMTEm7g'
  const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey)

  const container = document.getElementById('full-menu-container')

  async function loadFullMenu() {
    const [catResult, itemResult] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('menu_items').select('*').order('id', { ascending: true })
    ])

    if (catResult.error || itemResult.error) {
      container.innerHTML = '<div class="full-menu-empty">Failed to load menu. Please try again later.</div>'
      return
    }

    const categories = catResult.data || []
    const items = itemResult.data || []

    if (categories.length === 0) {
      container.innerHTML = '<div class="full-menu-empty">No categories available yet.</div>'
      return
    }

    container.innerHTML = categories.map(cat => {
      const catItems = items.filter(i => i.category_id === cat.id)
      if (catItems.length === 0) return ''

      return `
        <div class="full-menu-category">
          <div class="full-menu-category-header">
            <h2>${cat.name}</h2>
            <span>${catItems.length} item${catItems.length > 1 ? 's' : ''}</span>
          </div>
          <div class="full-menu-items">
            ${catItems.map(item => `
              <div class="full-menu-item">
                <div class="full-menu-item-img">
                  ${item.image_url
                    ? `<img src="${item.image_url}" alt="${item.name}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fa-solid fa-image\\' style=\\'font-size:1.5rem;color:#D1D5DB;display:flex;align-items:center;justify-content:center;height:100%;\\'></i>'">`
                    : `<i class="fa-solid fa-image" style="font-size:1.5rem;color:#D1D5DB;display:flex;align-items:center;justify-content:center;height:100%;"></i>`
                  }
                </div>
                <div class="full-menu-item-info">
                  <h3>${item.name}</h3>
                  <p>${item.description}</p>
                  ${item.price ? `<div class="full-menu-item-price">₹${item.price}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `
    }).join('')
  }

  loadFullMenu()

  // Mobile nav
  const hamburger = document.getElementById('mobile-nav-toggle')
  const navMenu = document.getElementById('nav-menu')
  const navOverlay = document.getElementById('nav-overlay')

  function openMenu() {
    hamburger.classList.add('active')
    navMenu.classList.add('active')
    navOverlay.classList.add('active')
    hamburger.setAttribute('aria-expanded', 'true')
    document.body.style.overflow = 'hidden'
  }

  function closeMenu() {
    hamburger.classList.remove('active')
    navMenu.classList.remove('active')
    navOverlay.classList.remove('active')
    hamburger.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
  }

  hamburger?.addEventListener('click', () => {
    navMenu.classList.contains('active') ? closeMenu() : openMenu()
  })

  navOverlay?.addEventListener('click', closeMenu)

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu)
  })

  // Header scroll class
  const header = document.querySelector('.header')
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 50)
  }, { passive: true })
})
