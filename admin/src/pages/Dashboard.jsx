import { useEffect, useState } from 'react'
import { supabase, resolveImageUrl } from '../supabase/client'

export default function Dashboard() {
  const [stats, setStats] = useState({ menuItems: 0, addresses: 0 })

  const [heroSlides, setHeroSlides] = useState([])
  const [heroName, setHeroName] = useState('')
  const [heroFile, setHeroFile] = useState(null)
  const [heroUploading, setHeroUploading] = useState(false)

  const [storyImages, setStoryImages] = useState([])
  const [storyFile, setStoryFile] = useState(null)
  const [storyUploading, setStoryUploading] = useState(false)

  const [storySlideIndex, setStorySlideIndex] = useState(0)

  useEffect(() => {
    async function loadStats() {
      const { count: menuCount } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
      const { count: addrCount } = await supabase
        .from('addresses')
        .select('*', { count: 'exact', head: true })
      setStats({ menuItems: menuCount || 0, addresses: addrCount || 0 })
    }
    loadStats()
    loadHeroSlides()
    loadStoryImages()
  }, [])

  async function loadHeroSlides() {
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })
    if (data) setHeroSlides(data)
  }

  async function uploadHeroImage(file) {
    const ext = file.name.split('.').pop()
    const fileName = `hero-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(fileName, file)
    if (uploadError) return null
    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(fileName)
    return publicUrl
  }

  async function handleAddHeroSlide(e) {
    e.preventDefault()
    if (!heroName || !heroFile) return
    setHeroUploading(true)

    const imageUrl = await uploadHeroImage(heroFile)
    if (!imageUrl) { setHeroUploading(false); return }

    await supabase.from('hero_slides').insert([
      { name: heroName, image_url: imageUrl, sort_order: heroSlides.length + 1 }
    ])

    setHeroName('')
    setHeroFile(null)
    setHeroUploading(false)
    loadHeroSlides()
  }

  async function handleDeleteHeroSlide(id) {
    if (!confirm('Delete this hero slide?')) return
    const slide = heroSlides.find(s => s.id === id)
    if (slide?.image_url) {
      const path = slide.image_url.split('/').pop()
      await supabase.storage.from('hero-images').remove([path])
    }
    await supabase.from('hero_slides').delete().eq('id', id)
    loadHeroSlides()
  }

  async function loadStoryImages() {
    const { data } = await supabase
      .from('story_images')
      .select('*')
      .order('sort_order', { ascending: true })
    if (data) {
      setStoryImages(data)
      setStorySlideIndex(0)
    }
  }

  async function uploadStoryImage(file) {
    const ext = file.name.split('.').pop()
    const fileName = `story-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('story-images')
      .upload(fileName, file)
    if (uploadError) return null
    const { data: { publicUrl } } = supabase.storage
      .from('story-images')
      .getPublicUrl(fileName)
    return publicUrl
  }

  async function handleAddStoryImage(e) {
    e.preventDefault()
    if (!storyFile) return
    setStoryUploading(true)

    const imageUrl = await uploadStoryImage(storyFile)
    if (!imageUrl) { setStoryUploading(false); return }

    await supabase.from('story_images').insert([
      { image_url: imageUrl, sort_order: storyImages.length + 1 }
    ])

    setStoryFile(null)
    setStoryUploading(false)
    loadStoryImages()
  }

  async function handleDeleteStoryImage(id) {
    if (!confirm('Delete this story image?')) return
    const img = storyImages.find(s => s.id === id)
    if (img?.image_url) {
      const path = img.image_url.split('/').pop()
      await supabase.storage.from('story-images').remove([path])
    }
    await supabase.from('story_images').delete().eq('id', id)
  }

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Overview of your store</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-menu">
            <i className="fa-solid fa-utensils"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.menuItems}</span>
            <span className="stat-label">Menu Items</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-address">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.addresses}</span>
            <span className="stat-label">Addresses</span>
          </div>
        </div>
      </div>

      <div className="dashboard-panels">
        {/* LEFT: Hero Slider Manager */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title"><i className="fa-solid fa-images"></i> Hero Slider</h2>
            <span className="panel-badge">{heroSlides.length} slides</span>
          </div>

          <form className="panel-form" onSubmit={handleAddHeroSlide}>
            <div className="panel-form-row">
              <input
                type="text"
                placeholder="Slide name"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroFile(e.target.files[0])}
                required
              />
            </div>
            <button className="btn btn-primary btn-sm" type="submit" disabled={heroUploading}>
              {heroUploading ? 'Uploading...' : 'Add Slide'}
            </button>
          </form>

          <div className="panel-list">
            {heroSlides.map(slide => (
              <div key={slide.id} className="panel-list-item">
                <div className="panel-list-thumb">
                  {slide.image_url ? (
                    <img src={resolveImageUrl(slide.image_url)} alt={slide.name} />
                  ) : (
                    <div className="panel-thumb-placeholder"><i className="fa-solid fa-image"></i></div>
                  )}
                </div>
                <div className="panel-list-info">
                  <span className="panel-list-name">{slide.name}</span>
                  <span className="panel-list-meta">Order: {slide.sort_order}</span>
                </div>
                <button className="btn-icon btn-delete btn-icon-sm" onClick={() => handleDeleteHeroSlide(slide.id)} title="Delete">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
            {heroSlides.length === 0 && <p className="panel-empty">No slides yet</p>}
          </div>
        </div>

        {/* RIGHT: Story Images Manager */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title"><i className="fa-solid fa-book-open"></i> Story Images</h2>
            <span className="panel-badge">{storyImages.length} images</span>
          </div>

          <form className="panel-form" onSubmit={handleAddStoryImage}>
            <div className="panel-form-row">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setStoryFile(e.target.files[0])}
                required
              />
            </div>
            <button className="btn btn-primary btn-sm" type="submit" disabled={storyUploading}>
              {storyUploading ? 'Uploading...' : 'Add Image'}
            </button>
          </form>

          {storyImages.length > 0 && (
            <div className="story-preview-slider">
              <div className="story-preview-img-wrap">
                {storyImages.map((img, i) => (
                  <div
                    key={img.id}
                    className={`story-preview-slide ${i === storySlideIndex ? 'active' : ''}`}
                  >
                    <img src={resolveImageUrl(img.image_url)} alt={`Story ${i + 1}`} />
                    <button className="btn-icon btn-delete btn-icon-overlay" onClick={() => handleDeleteStoryImage(img.id)} title="Delete">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
              {storyImages.length > 1 && (
                <div className="story-preview-nav">
                  <button className="btn-icon btn-nav" onClick={() => setStorySlideIndex(i => (i - 1 + storyImages.length) % storyImages.length)}>
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <span className="story-preview-counter">{storySlideIndex + 1} / {storyImages.length}</span>
                  <button className="btn-icon btn-nav" onClick={() => setStorySlideIndex(i => (i + 1) % storyImages.length)}>
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          )}

          {storyImages.length === 0 && <p className="panel-empty">No images yet</p>}
        </div>
      </div>
    </div>
  )
}
