import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function MenuCards() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadCards() {
    setLoading(true)
    const { data, error } = await supabase
      .from('menu_cards')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error) setCards(data || [])
    setLoading(false)
  }

  useEffect(() => { loadCards() }, [])

  function handleAdd() {
    setEditingCard(null)
    setTitle('')
    setImageUrl('')
    setError('')
    setShowForm(true)
  }

  function handleEdit(card) {
    setEditingCard(card)
    setTitle(card.title)
    setImageUrl(card.image_url || '')
    setError('')
    setShowForm(true)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const ext = file.name.split('.').pop()
    const filename = `menu-card-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('menu-card-images')
      .upload(filename, file)
    if (uploadError) {
      setError('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage
      .from('menu-card-images')
      .getPublicUrl(filename)
    setImageUrl(publicUrl)
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError('')
    const payload = { title: title.trim(), image_url: imageUrl }

    if (editingCard) {
      const { error: updateError } = await supabase
        .from('menu_cards')
        .update(payload)
        .eq('id', editingCard.id)
      if (updateError) setError(updateError.message)
    } else {
      payload.sort_order = cards.length + 1
      const { error: insertError } = await supabase
        .from('menu_cards')
        .insert([payload])
      if (insertError) setError(insertError.message)
    }
    setSaving(false)
    if (!error) {
      setShowForm(false)
      setEditingCard(null)
      loadCards()
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this menu card?')) return
    const card = cards.find(c => c.id === id)
    if (card?.image_url) {
      const path = card.image_url.split('/').pop()
      await supabase.storage.from('menu-card-images').remove([path])
    }
    await supabase.from('menu_cards').delete().eq('id', id)
    loadCards()
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Cards</h1>
          <p className="page-subtitle">Manage menu card images displayed on the home page</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fa-solid fa-plus"></i> Add Card
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}
               style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{editingCard ? 'Edit Card' : 'Add Card'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="form-error">{error}</div>}
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Menu Page 1" required />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleUpload}
                  disabled={uploading} />
                {uploading && <span className="form-hint">Uploading...</span>}
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="form-preview" />
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  {saving ? 'Saving...' : editingCard ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : cards.length === 0 ? (
        <p className="empty-text">No menu cards yet. Click "Add Card" to create one.</p>
      ) : (
        <div className="menu-cards-grid">
          {cards.map(card => (
            <div key={card.id} className="menu-card-item">
              <div className="menu-card-thumb">
                {card.image_url ? (
                  <img src={card.image_url} alt={card.title} />
                ) : (
                  <div className="menu-card-thumb-placeholder">
                    <i className="fa-solid fa-image"></i>
                  </div>
                )}
              </div>
              <div className="menu-card-info">
                <span className="menu-card-name">{card.title}</span>
              </div>
              <div className="menu-card-actions">
                <button className="btn-icon btn-edit" onClick={() => handleEdit(card)} title="Edit">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button className="btn-icon btn-delete" onClick={() => handleDelete(card.id)} title="Delete">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
