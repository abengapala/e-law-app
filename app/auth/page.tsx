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
      if (error) { setError(error.message) }
      else {
        if (data.user?.email === 'ederalbertoabrazado28@gmail.com') router.push('/admin')
        else router.push('/dashboard')
      }
    } else {
      if (!fullName) { setError('Please enter your full name.'); setLoading(false); return }
      if (!phone) { setError('Please enter your phone number.'); setLoading(false); return }
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message) }
      else if (data.user) {
        await supabase.from('profiles').insert({ id: data.user.id, full_name: fullName, phone })
        setMessage('✅ Account created! You can now log in.')
        setIsLogin(true)
      }
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #f59e0b; --gold-dim: rgba(245,158,11,0.1); --gold-border: rgba(245,158,11,0.2);
          --navy: #0a0f1e; --card2: #161d2e; --text: #f1f5f9; --muted: #94a3b8; --border: rgba(255,255,255,0.06);
        }
        html, body { overflow-x: hidden; min-height: 100vh; }
        body { font-family: 'DM Sans', sans-serif; font-weight: 400; background: var(--navy); color: var(--text); }
        .page {
          min-height: 100vh; display: flex;
          background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 65%),
                      radial-gradient(ellipse 50% 50% at 80% 100%, rgba(16,185,129,0.04) 0%, transparent 60%);
        }
        .left {
          flex: 1; display: none; flex-direction: column; justify-content: center; padding: 5rem;
          background: linear-gradient(135deg, rgba(245,158,11,0.05) 0%, transparent 60%);
          border-right: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .left-bg {
          position: absolute; inset: 0; z-index: 0;
          background: url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=70') center/cover no-repeat;
          opacity: 0.08;
        }
        .left-content { position: relative; z-index: 1; }
        .left-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; color: var(--text); display: flex; align-items: center; gap: 0.6rem; margin-bottom: 3rem; text-decoration: none; }
        .left-logo-icon { width: 36px; height: 36px; background: var(--gold); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
        .left-logo span { color: var(--gold); }
        .left-title { font-family: 'Syne', sans-serif; font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; line-height: 1.1; margin-bottom: 1.25rem; }
        .left-title span { color: var(--gold); }
        .left-desc { color: var(--muted); font-size: 1rem; line-height: 1.75; max-width: 400px; margin-bottom: 2.5rem; }
        .left-stats { display: flex; flex-direction: column; gap: 1rem; }
        .left-stat { display: flex; align-items: center; gap: 0.75rem; }
        .left-stat-icon { width: 36px; height: 36px; background: var(--gold-dim); border: 1px solid var(--gold-border); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .left-stat-text { font-size: 0.88rem; color: var(--muted); }
        .left-stat-text strong { color: var(--text); font-weight: 600; display: block; font-size: 0.92rem; }
        .right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .card {
          background: var(--card2); border: 1px solid var(--border);
          border-radius: 24px; padding: 2.5rem; width: 100%; max-width: 420px;
          box-shadow: 0 30px 70px rgba(0,0,0,0.5);
        }
        .logo-wrap { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem; }
        .logo-icon { width: 32px; height: 32px; background: var(--gold); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; }
        .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.3rem; letter-spacing: 0.02em; }
        .logo-text span { color: var(--gold); }
        .subtitle { font-size: 0.82rem; color: var(--muted); margin-bottom: 2rem; margin-top: 0.25rem; font-weight: 400; }
        .tabs { display: flex; background: rgba(255,255,255,0.04); border-radius: 10px; padding: 4px; margin-bottom: 2rem; gap: 4px; }
        .tab { flex: 1; padding: 0.65rem; border-radius: 8px; border: none; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.02em; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--muted); }
        .tab.active { background: var(--gold); color: var(--navy); }
        .field { margin-bottom: 1rem; }
        .field-label { font-size: 0.78rem; color: var(--muted); display: block; margin-bottom: 0.4rem; font-weight: 500; letter-spacing: 0.03em; }
        input {
          width: 100%; padding: 0.875rem 1rem;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: var(--text);
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 400;
          outline: none; transition: border-color 0.2s;
        }
        input:focus { border-color: var(--gold); background: rgba(245,158,11,0.04); }
        input::placeholder { color: rgba(148,163,184,0.45); }
        .btn {
          width: 100%; padding: 0.9rem; border-radius: 10px; border: none;
          background: var(--gold); color: var(--navy);
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.92rem;
          letter-spacing: 0.02em; cursor: pointer; transition: all 0.2s; margin-top: 0.5rem;
        }
        .btn:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.3); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.82rem; margin-top: 1rem; }
        .success { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7; padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.82rem; margin-top: 1rem; }
        .back { display: block; text-align: center; margin-top: 1.5rem; color: var(--muted); font-size: 0.82rem; text-decoration: none; transition: color 0.2s; }
        .back:hover { color: var(--gold); }
        @media (min-width: 1024px) { .left { display: flex; } }
        @media (max-width: 768px) { .right { padding: 1.25rem; align-items: flex-start; padding-top: 3rem; } .card { padding: 1.75rem; } }
      `}</style>

      <div className="page">
        <div className="left">
          <div className="left-bg" />
          <div className="left-content">
            <a href="/" className="left-logo">
              <div className="left-logo-icon">☀️</div>
              E-<span>LAW</span> Solar
            </a>
            <h2 className="left-title">Start Saving on<br />Electricity <span>Today</span></h2>
            <p className="left-desc">Join hundreds of Filipino families who have cut their electricity bills by up to 90% with E-LAW Solar.</p>
            <div className="left-stats">
              {[
                { icon: '⚡', label: 'Up to 90% savings', sub: 'On your monthly electricity bill' },
                { icon: '🔧', label: 'Free installation', sub: 'Professional certified installers' },
                { icon: '📞', label: '24/7 support', sub: 'Filipino-first customer service' },
              ].map((s, i) => (
                <div className="left-stat" key={i}>
                  <div className="left-stat-icon">{s.icon}</div>
                  <div className="left-stat-text">
                    <strong>{s.label}</strong>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right">
          <div className="card">
            <div className="logo-wrap">
              <div className="logo-icon">☀️</div>
              <div className="logo-text">E-<span>LAW</span> Solar</div>
            </div>
            <div className="subtitle">Customer Portal — Manage your solar journey</div>

            <div className="tabs">
              <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
              <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
            </div>

            {!isLogin && (
              <>
                <div className="field">
                  <label className="field-label">Full Name</label>
                  <input placeholder="Juan dela Cruz" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div className="field">
                  <label className="field-label">Phone Number</label>
                  <input placeholder="09xxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </>
            )}

            <div className="field">
              <label className="field-label">Email Address</label>
              <input type="email" placeholder="juan@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <button className="btn" onClick={handleAuth} disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Login to Dashboard →' : 'Create Account →'}
            </button>

            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}
            <a href="/" className="back">← Back to Homepage</a>
          </div>
        </div>
      </div>
    </>
  )
}
