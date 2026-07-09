import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function Dashboard() {
  const [stats, setStats] = useState({ menuItems: 0, addresses: 0 })

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
  }, [])

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
    </div>
  )
}
