import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import MenuForm from '../components/MenuForm'

export default function MenuManagement() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  async function loadItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { loadItems() }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this menu item?')) return
    await supabase.from('menu_items').delete().eq('id', id)
    loadItems()
  }

  function handleEdit(item) {
    setEditingItem(item)
    setShowForm(true)
  }

  function handleAdd() {
    setEditingItem(null)
    setShowForm(true)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Management</h1>
          <p className="page-subtitle">Add, edit, or remove menu items</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fa-solid fa-plus"></i> Add Item
        </button>
      </div>

      {showForm && (
        <MenuForm
          item={editingItem}
          onClose={() => { setShowForm(false); setEditingItem(null) }}
          onSaved={() => { setShowForm(false); setEditingItem(null); loadItems() }}
        />
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : items.length === 0 ? (
        <p className="empty-text">No menu items yet. Click "Add Item" to create one.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="table-thumb" />
                    ) : (
                      <div className="table-thumb-placeholder">
                        <i className="fa-solid fa-image"></i>
                      </div>
                    )}
                  </td>
                  <td className="cell-name">{item.name}</td>
                  <td className="cell-desc">{item.description}</td>
                  <td>{item.price ? `₹${item.price}` : '-'}</td>
                  <td>{item.category || '-'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(item)} title="Edit">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(item.id)} title="Delete">
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
