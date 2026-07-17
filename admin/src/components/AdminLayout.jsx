import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { useState } from 'react'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const navItems = [
    { to: '/', icon: 'fa-chart-pie', label: 'Dashboard', end: true },
    { to: '/menu', icon: 'fa-utensils', label: 'Menu' },
    { to: '/addresses', icon: 'fa-location-dot', label: 'Addresses' },
    { to: '/menu-cards', icon: 'fa-rectangle-ad', label: 'Menu Cards' },
    { to: '/reviews', icon: 'fa-comments', label: 'Reviews' },
    { to: '/events', icon: 'fa-calendar-days', label: 'Events' },
  ]

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <img src="../assets/images/hero bg/labaanwala logo.jpeg" alt="Labaanwala" className="sidebar-logo" />
          <span className="sidebar-brand-text">Labaanwala</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className={`sidebar-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)}></div>

      <main className="main-content">
        <header className="topbar">
          <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <span className="topbar-title">Admin Dashboard</span>
          <div className="topbar-spacer"></div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
