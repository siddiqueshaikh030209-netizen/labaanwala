import { useEffect, useState } from 'react'
import { supabase, resolveImageUrl } from '../supabase/client'

export default function EventsManagement() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    event_date: '',
    event_type: 'promotion',
    badge_text: '',
    is_active: true,
    sort_order: 0
  })

  const eventTypes = [
    { value: 'promotion', label: 'Promotion', icon: 'fa-tag' },
    { value: 'private_booking', label: 'Private Booking', icon: 'fa-calendar-check' },
    { value: 'special_offer', label: 'Special Offer', icon: 'fa-percent' },
    { value: 'festival', label: 'Festival', icon: 'fa-gift' },
    { value: 'new_launch', label: 'New Launch', icon: 'fa-rocket' }
  ]

  async function loadEvents() {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error) setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => { loadEvents() }, [])

  function resetForm() {
    setForm({
      title: '',
      description: '',
      image_url: '',
      event_date: '',
      event_type: 'promotion',
      badge_text: '',
      is_active: true,
      sort_order: 0
    })
  }

  function handleAdd() {
    resetForm()
    setEditingEvent(null)
    setShowForm(true)
  }

  function handleEdit(event) {
    setForm({
      title: event.title || '',
      description: event.description || '',
      image_url: event.image_url || '',
      event_date: event.event_date ? event.event_date.split('T')[0] : '',
      event_type: event.event_type || 'promotion',
      badge_text: event.badge_text || '',
      is_active: event.is_active ?? true,
      sort_order: event.sort_order || 0
    })
    setEditingEvent(event)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      event_date: form.event_date || null,
      event_type: form.event_type,
      badge_text: form.badge_text.trim() || null,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0
    }

    if (editingEvent) {
      await supabase.from('events').update(payload).eq('id', editingEvent.id)
    } else {
      await supabase.from('events').insert([payload])
    }

    setShowForm(false)
    setEditingEvent(null)
    resetForm()
    loadEvents()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    loadEvents()
  }

  async function handleToggleActive(event) {
    await supabase.from('events').update({ is_active: !event.is_active }).eq('id', event.id)
    loadEvents()
  }

  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(prev => ({ ...prev, image_url: reader.result }))
    reader.readAsDataURL(file)
  }

  async function uploadImageToStorage(dataUrl) {
    if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    const ext = blob.type.split('/')[1] || 'jpg'
    const fileName = `event-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(fileName, blob, { contentType: blob.type })
    if (error) { console.error('Upload error:', error); return null }
    const { data: urlData } = supabase.storage.from('event-images').getPublicUrl(data.path)
    return urlData.publicUrl
  }

  async function handleSubmitWithUpload(e) {
    e.preventDefault()
    if (!form.title.trim()) return

    let imageUrl = form.image_url.trim() || null
    if (imageUrl && imageUrl.startsWith('data:')) {
      imageUrl = await uploadImageToStorage(imageUrl)
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: imageUrl,
      event_date: form.event_date || null,
      event_type: form.event_type,
      badge_text: form.badge_text.trim() || null,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0
    }

    if (editingEvent) {
      await supabase.from('events').update(payload).eq('id', editingEvent.id)
    } else {
      await supabase.from('events').insert([payload])
    }

    setShowForm(false)
    setEditingEvent(null)
    resetForm()
    loadEvents()
  }

  const typeLabels = {
    promotion: 'Promotion',
    private_booking: 'Private Booking',
    special_offer: 'Special Offer',
    festival: 'Festival',
    new_launch: 'New Launch'
  }

  if (loading) return <div className="page"><p className="loading-text">Loading...</p></div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Events Management</h1>
          <p className="page-subtitle">Manage promotions, bookings, and special offers</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            <i className="fa-solid fa-plus"></i> Add Event
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}
               style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h2>{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitWithUpload} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Private Dessert Catering"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the event..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Type</label>
                  <select
                    value={form.event_type}
                    onChange={(e) => setForm(prev => ({ ...prev, event_type: e.target.value }))}
                  >
                    {eventTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={form.event_date}
                    onChange={(e) => setForm(prev => ({ ...prev, event_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Badge Text</label>
                  <input
                    type="text"
                    value={form.badge_text}
                    onChange={(e) => setForm(prev => ({ ...prev, badge_text: e.target.value }))}
                    placeholder="e.g. Book Now, Limited Time"
                  />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm(prev => ({ ...prev, sort_order: e.target.value }))}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {form.image_url && (
                  <div className="image-preview" style={{ marginTop: '0.75rem' }}>
                    <img
                      src={form.image_url}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    style={{ width: 'auto' }}
                  />
                  Active (visible on website)
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update' : 'Add'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <p className="empty-text">No events yet. Click "Add Event" to create one.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>
                    {event.image_url ? (
                      <img src={resolveImageUrl(event.image_url)} alt={event.title} className="table-thumb"
                           style={{ objectFit: 'cover' }}
                           onerror="this.style.display='none'" />
                    ) : (
                      <div className="table-thumb-placeholder">
                        <i className="fa-solid fa-calendar"></i>
                      </div>
                    )}
                  </td>
                  <td className="cell-name">
                    <div>{event.title}</div>
                    {event.badge_text && (
                      <span className="badge-text" style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                        {event.badge_text}
                      </span>
                    )}
                  </td>
                  <td>{typeLabels[event.event_type] || event.event_type}</td>
                  <td>{event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</td>
                  <td>
                    <button
                      className={`status-toggle ${event.is_active ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(event)}
                      title={event.is_active ? 'Click to deactivate' : 'Click to activate'}
                    >
                      {event.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(event)} title="Edit">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(event.id)} title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
