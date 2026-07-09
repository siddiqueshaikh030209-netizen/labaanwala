import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import AddressForm from '../components/AddressForm'

export default function AddressManagement() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  async function loadAddresses() {
    setLoading(true)
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .order('is_primary', { ascending: false })

    if (!error) setAddresses(data || [])
    setLoading(false)
  }

  useEffect(() => { loadAddresses() }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this address?')) return
    await supabase.from('addresses').delete().eq('id', id)
    loadAddresses()
  }

  function handleEdit(addr) {
    setEditingAddress(addr)
    setShowForm(true)
  }

  function handleAdd() {
    setEditingAddress(null)
    setShowForm(true)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Address Management</h1>
          <p className="page-subtitle">Manage store locations</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fa-solid fa-plus"></i> Add Address
        </button>
      </div>

      {showForm && (
        <AddressForm
          address={editingAddress}
          onClose={() => { setShowForm(false); setEditingAddress(null) }}
          onSaved={() => { setShowForm(false); setEditingAddress(null); loadAddresses() }}
        />
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : addresses.length === 0 ? (
        <p className="empty-text">No addresses yet. Click "Add Address" to create one.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Primary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map(addr => (
                <tr key={addr.id}>
                  <td className="cell-name">{addr.name}</td>
                  <td>{addr.phone}</td>
                  <td className="cell-desc">{addr.address_text}</td>
                  <td>{addr.is_primary ? <span className="badge badge-primary">Yes</span> : '-'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(addr)} title="Edit">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(addr.id)} title="Delete">
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
