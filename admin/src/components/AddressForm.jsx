import { useState } from 'react'
import { supabase } from '../supabase/client'

export default function AddressForm({ address, onClose, onSaved }) {
  const [name, setName] = useState(address?.name || '')
  const [phone, setPhone] = useState(address?.phone || '')
  const [addressText, setAddressText] = useState(address?.address_text || '')
  const [mapEmbedUrl, setMapEmbedUrl] = useState(address?.map_embed_url || '')
  const [isPrimary, setIsPrimary] = useState(address?.is_primary || false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = { name, phone, address_text: addressText, map_embed_url: mapEmbedUrl || null, is_primary: isPrimary }

    let result
    if (address?.id) {
      result = await supabase.from('addresses').update(payload).eq('id', address.id)
    } else {
      result = await supabase.from('addresses').insert([payload])
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
          <h2>{address ? 'Edit Address' : 'Add Address'}</h2>
          <button className="modal-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name / Label</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Main Store" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 97307 38285" />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea value={addressText} onChange={(e) => setAddressText(e.target.value)} rows={3} placeholder="Full address" required />
          </div>

          <div className="form-group">
            <label>Google Maps Embed URL</label>
            <input type="url" value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} placeholder="https://maps.google.com/maps?q=..." />
            <p className="form-hint">Paste the iframe src URL from Google Maps embed</p>
          </div>

          <div className="form-group form-checkbox">
            <label>
              <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
              <span>Set as primary address</span>
            </label>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : address ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
