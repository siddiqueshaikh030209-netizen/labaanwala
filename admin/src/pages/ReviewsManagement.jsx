import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  async function loadReviews() {
    setLoading(true)
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (filter === 'pending') query = query.eq('is_approved', false)
    if (filter === 'approved') query = query.eq('is_approved', true)
    const { data, error } = await query
    if (!error) setReviews(data || [])
    setLoading(false)
  }

  useEffect(() => { loadReviews() }, [filter])

  async function handleApprove(id) {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id)
    loadReviews()
  }

  async function handleReject(id) {
    await supabase.from('reviews').update({ is_approved: false }).eq('id', id)
    loadReviews()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this review? This action cannot be undone.')) return
    await supabase.from('reviews').delete().eq('id', id)
    loadReviews()
  }

  const pendingCount = reviews.filter(r => !r.is_approved).length
  const approvedCount = reviews.filter(r => r.is_approved).length
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) return <div className="page"><p className="loading-text">Loading...</p></div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Reviews</h1>
          <p className="page-subtitle">Manage and moderate customer reviews</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-menu">
            <i className="fa-solid fa-comments"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{reviews.length}</span>
            <span className="stat-label">Total Reviews</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-address">
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending Approval</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-menu">
            <i className="fa-solid fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{approvedCount}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-address">
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{avgRating}</span>
            <span className="stat-label">Average Rating</span>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({reviews.length})
        </button>
        <button
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved ({approvedCount})
        </button>
      </div>

      {reviews.length === 0 ? (
        <p className="empty-text">No reviews yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id}>
                  <td className="cell-name">{review.customer_name}</td>
                  <td>
                    <div className="review-stars-admin">
                      {[1, 2, 3, 4, 5].map(star => (
                        <i
                          key={star}
                          className={`fa-solid fa-star ${star <= review.rating ? 'star-filled' : 'star-empty'}`}
                        ></i>
                      ))}
                    </div>
                  </td>
                  <td className="cell-desc">{review.comment}</td>
                  <td>{new Date(review.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${review.is_approved ? 'status-approved' : 'status-pending'}`}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {!review.is_approved && (
                        <button className="btn-icon btn-edit" onClick={() => handleApprove(review.id)} title="Approve">
                          <i className="fa-solid fa-check"></i>
                        </button>
                      )}
                      {review.is_approved && (
                        <button className="btn-icon btn-delete" onClick={() => handleReject(review.id)} title="Reject">
                          <i className="fa-solid fa-ban"></i>
                        </button>
                      )}
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(review.id)} title="Delete">
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
