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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; min-height: 100vh; }
        body { font-family: 'DM Sans', sans-serif; background: #0E1C29; color: #fff; }
        .page {
          min-height: 100vh; display: flex;
          background: linear-gradient(135deg, rgba(14,28,41,1) 0%, rgba(10,21,32,1) 100%);
        }
        .left {
          flex: 1; display: none; flex-direction: column; justify-content: center;
          padding: 5rem; border-right: 1px solid rgba(255,255,255,0.05);
          background: linear-gradient(180deg, rgba(14,28,41,0.4) 0%, rgba(14,28,41,0.8) 100%),
            url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=70') center/cover no-repeat;
          position: relative;
        }
        .left-content { position: relative; z-index: 1; }
        .left-logo { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.2rem; color: #fff; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 3rem; text-decoration: none; letter-spacing: 0.02em; }
        .left-logo-icon { width: 30px; height: 30px; background: #1AA3DE; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .left-title { font-family: 'Inter', sans-serif; font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 300; letter-spacing: 3px; text-transform: uppercase; line-height: 1.1; margin-bottom: 1rem; color: #fff; }
        .left-tagline { font-size: 0.7rem; color: #1AA3DE; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; font-family: 'DM Sans', sans-serif; }
        .left-desc { color: rgba(255,255,255,0.5); font-size: 0.85rem; line-height: 1.75; max-width: 360px; margin-bottom: 2.5rem; font-family: 'DM Sans', sans-serif; }
        .left-stats { display: flex; flex-direction: column; gap: 0.85rem; }
        .left-stat { display: flex; align-items: center; gap: 0.75rem; }
        .left-stat-icon { width: 32px; height: 32px; background: rgba(26,163,222,0.12); border: 1px solid rgba(26,163,222,0.2); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .left-stat-text { font-size: 0.82rem; color: rgba(255,255,255,0.45); font-family: 'DM Sans', sans-serif; }
        .left-stat-text strong { color: rgba(255,255,255,0.8); font-weight: 500; display: block; font-size: 0.85rem; }
        .right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 2.5rem; width: 100%; max-width: 400px; box-shadow: 0 24px 60px rgba(0,0,0,0.4); }
       .logo-wrap { display: flex; align-items: center; justify-content: center; margin-bottom: 0.25rem; }
        .logo-icon { width: 28px; height: 28px; background: #1AA3DE; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
        .logo-text { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; letter-spacing: 0.02em; }
        .subtitle { font-size: 0.78rem; color: rgba(255,255,255,0.38); margin-bottom: 1.75rem; margin-top: 0.2rem; font-family: 'DM Sans', sans-serif; }
        .tabs { display: flex; background: rgba(255,255,255,0.04); border-radius: 7px; padding: 3px; margin-bottom: 1.75rem; gap: 3px; border: 1px solid rgba(255,255,255,0.06); }
        .tab { flex: 1; padding: 0.6rem; border-radius: 5px; border: none; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.83rem; cursor: pointer; transition: all 0.2s; background: transparent; color: rgba(255,255,255,0.45); }
        .tab.active { background: #1AA3DE; color: #fff; }
        .field { margin-bottom: 0.85rem; }
        .field-label { font-size: 0.73rem; color: rgba(255,255,255,0.4); display: block; margin-bottom: 0.35rem; font-weight: 400; letter-spacing: 0.03em; font-family: 'DM Sans', sans-serif; }
        input { width: 100%; padding: 0.8rem 0.95rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 7px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 400; outline: none; transition: border-color 0.2s; }
        input:focus { border-color: #1AA3DE; background: rgba(26,163,222,0.04); }
        input::placeholder { color: rgba(255,255,255,0.2); }
        .btn { width: 100%; padding: 0.85rem; border-radius: 7px; border: none; background: #1AA3DE; color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; margin-top: 0.5rem; }
        .btn:hover { background: #1591c7; transform: translateY(-1px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .error { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.18); color: rgba(252,165,165,0.9); padding: 0.7rem 0.9rem; border-radius: 7px; font-size: 0.8rem; margin-top: 0.85rem; font-family: 'DM Sans', sans-serif; }
        .success { background: rgba(26,163,222,0.07); border: 1px solid rgba(26,163,222,0.18); color: rgba(147,210,237,0.9); padding: 0.7rem 0.9rem; border-radius: 7px; font-size: 0.8rem; margin-top: 0.85rem; font-family: 'DM Sans', sans-serif; }
        .back { display: block; text-align: center; margin-top: 1.25rem; color: rgba(255,255,255,0.3); font-size: 0.78rem; text-decoration: none; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
        .back:hover { color: #1AA3DE; }
        @media (min-width: 1024px) { .left { display: flex; } }
        @media (max-width: 768px) { .right { padding: 1.25rem; align-items: flex-start; padding-top: 3rem; } .card { padding: 1.75rem; } }
      `}</style>

      <div className="page">
        <div className="left">
          <div className="left-content">
            <h2 className="left-title">Renewable Energy for Filipino Homes</h2>
            <div className="left-tagline">Empowering Low-cost Affordable Watts</div>
            <p className="left-desc">Join Filipino families who have cut their electricity bills by up to 90% with E-LAW Solar. Flexible payment options designed for every budget.</p>
            <div className="left-stats">
              {[
                { icon: '⚡', label: '50–90% bill reduction', sub: 'On your monthly electricity cost' },
                { icon: '🔧', label: 'Free installation', sub: 'Professional certified installers' },
                { icon: '📞', label: 'Filipino-first support', sub: 'Tagalog & English customer service' },
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
  <img src="/logo.png" alt="E-LAW Solar" style={{height:'100px', width:'auto', objectFit:'contain'}} />
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
