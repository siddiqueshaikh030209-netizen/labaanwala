import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: `${username}@labaanwala.com`,
      password,
    })

    setLoading(false)

    if (authError) {
      setError('Invalid username or password')
      return
    }

    navigate('/')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src="../assets/images/hero bg/labaanwala logo.jpeg" alt="Labaanwala" className="login-logo" />
          <h1 className="login-title">Admin Dashboard</h1>
          <p className="login-subtitle">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
