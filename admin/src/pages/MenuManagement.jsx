import { useEffect, useState } from 'react'
import { supabase, resolveImageUrl } from '../supabase/client'
import MenuForm from '../components/MenuForm'

export default function MenuManagement() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [showItemForm, setShowItemForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [preselectedCategory, setPreselectedCategory] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [savingCategory, setSavingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editCategoryName, setEditCategoryName] = useState('')

  async function loadData() {
    setLoading(true)
    const [catResult, itemResult] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('menu_items').select('*').order('created_at', { ascending: false })
    ])
    if (!catResult.error) setCategories(catResult.data || [])
    if (!itemResult.error) setItems(itemResult.data || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  function getItemsForCategory(catId) {
    return items.filter(i => i.category_id === catId)
  }

  async function handleDeleteItem(id) {
    if (!confirm('Delete this menu item?')) return
    await supabase.from('menu_items').delete().eq('id', id)
    loadData()
  }

  function handleEditItem(item) {
    setEditingItem(item)
    setPreselectedCategory(null)
    setShowItemForm(true)
  }

  function handleAddItem(categoryId) {
    setEditingItem(null)
    setPreselectedCategory(categoryId)
    setShowItemForm(true)
  }

  async function handleAddCategory(e) {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    setSavingCategory(true)
    await supabase.from('categories').insert([
      { name: newCategoryName.trim(), sort_order: categories.length + 1 }
    ])
    setNewCategoryName('')
    setSavingCategory(false)
    setShowCategoryForm(false)
    loadData()
  }

  function handleEditCategory(cat) {
    setEditingCategory(cat)
    setEditCategoryName(cat.name)
  }

  async function handleUpdateCategory(e) {
    e.preventDefault()
    if (!editCategoryName.trim()) return
    await supabase.from('categories').update({ name: editCategoryName.trim() }).eq('id', editingCategory.id)
    setEditingCategory(null)
    setEditCategoryName('')
    loadData()
  }

  async function handleDeleteCategory(id) {
    if (!confirm('Delete this category? Items in it will lose category association.')) return
    await supabase.from('menu_items').update({ category_id: null }).eq('category_id', id)
    await supabase.from('categories').delete().eq('id', id)
    loadData()
  }

  if (loading) return <div className="page"><p className="loading-text">Loading...</p></div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Management</h1>
          <p className="page-subtitle">Manage categories and menu items</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => setShowCategoryForm(true)}>
            <i className="fa-solid fa-folder-plus"></i> Add Category
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingItem(null); setPreselectedCategory(null); setShowItemForm(true) }}>
            <i className="fa-solid fa-plus"></i> Add Item
          </button>
        </div>
      </div>

      {showItemForm && (
        <MenuForm
          item={editingItem}
          preselectedCategory={preselectedCategory}
          categories={categories}
          onClose={() => { setShowItemForm(false); setEditingItem(null); setPreselectedCategory(null) }}
          onSaved={() => { setShowItemForm(false); setEditingItem(null); setPreselectedCategory(null); loadData() }}
        />
      )}

      {showCategoryForm && (
        <div className="modal-overlay" onClick={() => setShowCategoryForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}
               style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Add Category</h2>
              <button className="modal-close" onClick={() => setShowCategoryForm(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="modal-form">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Signature"
                  required
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingCategory}>
                  {savingCategory ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="modal-overlay" onClick={() => setEditingCategory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}
               style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Edit Category</h2>
              <button className="modal-close" onClick={() => setEditingCategory(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateCategory} className="modal-form">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  placeholder="e.g. Signature"
                  required
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCategory(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <p className="empty-text">No categories yet. Click "Add Category" to create one.</p>
      ) : (
        <div className="category-cards-grid">
          {categories.map(cat => {
            const catItems = getItemsForCategory(cat.id)
            const isExpanded = expandedCategory === cat.id
            return (
              <div key={cat.id} className={`category-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="category-card-header" onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}>
                  <div className="category-card-info">
                    <h3 className="category-card-name">{cat.name}</h3>
                    <span className="category-card-count">{catItems.length} item{catItems.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="category-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="btn-icon btn-edit btn-icon-sm" onClick={() => handleEditCategory(cat)} title="Edit category name">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button className="btn-icon btn-add-sm" onClick={() => handleAddItem(cat.id)} title="Add item to this category">
                      <i className="fa-solid fa-plus"></i>
                    </button>
                    <button className="btn-icon btn-delete btn-icon-sm" onClick={() => handleDeleteCategory(cat.id)} title="Delete category">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  <i className={`fa-solid fa-chevron-down category-card-chevron ${isExpanded ? 'rotated' : ''}`}></i>
                </div>

                {isExpanded && (
                  <div className="category-card-items">
                    {catItems.length === 0 ? (
                      <p className="category-items-empty">No items in this category. Click + to add one.</p>
                    ) : (
                      <div className="table-wrap">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Description</th>
                              <th>Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {catItems.map(item => (
                              <tr key={item.id}>
                                <td>
                                  {item.image_url ? (
                                    <img src={resolveImageUrl(item.image_url)} alt={item.name} className="table-thumb"
                                         onerror="this.style.display='none'" />
                                  ) : (
                                    <div className="table-thumb-placeholder">
                                      <i className="fa-solid fa-image"></i>
                                    </div>
                                  )}
                                </td>
                                <td className="cell-name">{item.name}</td>
                                <td className="cell-desc">{item.description}</td>
                                <td>{item.price ? `₹${item.price}` : '-'}</td>
                                <td>
                                  <div className="action-btns">
                                    <button className="btn-icon btn-edit" onClick={() => handleEditItem(item)} title="Edit">
                                      <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button className="btn-icon btn-delete" onClick={() => handleDeleteItem(item.id)} title="Delete">
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
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
