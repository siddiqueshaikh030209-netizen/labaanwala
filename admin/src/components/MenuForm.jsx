import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export default function MenuForm({ item, onClose, onSaved }) {
  const [name, setName] = useState(item?.name || '')
  const [description, setDescription] = useState(item?.description || '')
  const [price, setPrice] = useState(item?.price || '')
  const [category, setCategory] = useState(item?.category || '')
  const [imageUrl, setImageUrl] = useState(item?.image_url || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file)

    if (uploadError) {
      setError('Failed to upload image')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName)

    setImageUrl(publicUrl)
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = { name, description, price: price ? Number(price) : null, category: category || null, image_url: imageUrl || null }

    let result
    if (item?.id) {
      result = await supabase.from('menu_items').update(payload).eq('id', item.id)
    } else {
      result = await supabase.from('menu_items').insert([payload])
    }

    setSaving(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    onSaved()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
          <button className="modal-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Signature" />
            </div>
          </div>

          <div className="form-group">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="form-hint">Uploading...</p>}
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="form-preview" />
            )}
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
