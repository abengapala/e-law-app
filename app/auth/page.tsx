'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
if (error) {
  setError(error.message)
} else {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  if (data.user?.email === 'e-lawsolar@gmail.com') {
    router.push('/admin')
  } else {
    router.push('/dashboard')
  }
}
    } else {
      if (!fullName) { setError('Please enter your full name.'); setLoading(false); return }
      if (!phone) { setError('Please enter your phone number.'); setLoading(false); return }

      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          phone: phone,
        })
        setMessage('✅ Account created! You can now log in.')
        setIsLogin(true)
      }
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0f1e; color: #e2e8f0; }
        .page {
          min-height: 100vh; display: flex;
          align-items: center; justify-content: center; padding: 2rem;
          background: radial-gradient(ellipse 60% 60% at 50% 20%, rgba(245,158,11,0.1) 0%, transparent 70%);
        }
        .card {
          background: #161d2e; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 2.5rem; width: 100%; max-width: 420px;
        }
        .logo { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #f59e0b; margin-bottom: 0.25rem; }
        .subtitle { font-size: 0.85rem; color: #94a3b8; margin-bottom: 2rem; }
        .tabs { display: flex; background: rgba(255,255,255,0.04); border-radius: 8px; padding: 4px; margin-bottom: 2rem; }
        .tab {
          flex: 1; padding: 0.6rem; border-radius: 6px; border: none;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; transition: all 0.2s; background: transparent; color: #94a3b8;
        }
        .tab.active { background: #f59e0b; color: #0a0f1e; }
        label { font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 0.4rem; }
        input {
          width: 100%; padding: 0.875rem 1rem; margin-bottom: 1rem;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #e2e8f0; font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; outline: none; transition: border-color 0.2s;
        }
        input:focus { border-color: #f59e0b; }
        .btn {
          width: 100%; padding: 0.875rem; border-radius: 8px; border: none;
          background: #f59e0b; color: #0a0f1e;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1rem; cursor: pointer; transition: opacity 0.2s; margin-top: 0.5rem;
        }
        .btn:hover { opacity: 0.85; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; margin-top: 1rem; }
        .success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; margin-top: 1rem; }
        .back { display: block; text-align: center; margin-top: 1.5rem; color: #94a3b8; font-size: 0.85rem; text-decoration: none; }
        .back:hover { color: #f59e0b; }
      `}</style>
      <div className="page">
        <div className="card">
          <div className="logo">☀️ E-LAW Solar</div>
          <div className="subtitle">Customer Portal — Manage your solar journey</div>
          <div className="tabs">
            <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
            <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
          </div>

          {!isLogin && (
            <>
              <label>Full Name</label>
              <input placeholder="Juan dela Cruz" value={fullName} onChange={e => setFullName(e.target.value)} />
              <label>Phone Number</label>
              <input placeholder="09xxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
            </>
          )}

          <label>Email Address</label>
          <input type="email" placeholder="juan@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />

          <button className="btn" onClick={handleAuth} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login →' : 'Create Account →'}
          </button>
          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}
          <a href="/" className="back">← Back to Homepage</a>
        </div>
      </div>
    </>
  )
}