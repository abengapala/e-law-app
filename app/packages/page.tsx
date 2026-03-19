'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const packages = [
  {
    id: 1, name: 'Bahay Saver', price: 45000, tagline: 'Starter Package',
    description: 'Perfect starter package for small homes',
    savings: 800, features: ['3 Solar Panels', '1.5kW Capacity', 'Basic Monitoring', '5 Year Warranty'],
    color: '#f59e0b'
  },
  {
    id: 2, name: 'Family Power', price: 85000, tagline: 'Most Popular',
    description: 'Ideal for average Filipino family homes',
    savings: 1500, features: ['6 Solar Panels', '3kW Capacity', 'Smart Monitoring', '10 Year Warranty'],
    popular: true, color: '#10b981'
  },
  {
    id: 3, name: 'Home Independence', price: 130000, tagline: 'Premium Package',
    description: 'Full energy independence for larger homes',
    savings: 2500, features: ['9 Solar Panels', '5kW Capacity', 'Advanced Monitoring', '15 Year Warranty'],
    color: '#3b82f6'
  },
  {
    id: 4, name: 'Zero Bill', price: 180000, tagline: 'Ultimate Package',
    description: 'Maximum output, zero electricity bill guaranteed',
    savings: 3500, features: ['12 Solar Panels', '8kW Capacity', 'Premium Monitoring', '20 Year Warranty'],
    color: '#8b5cf6'
  }
]

export default function PackagesPage() {
  const [loading, setLoading] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({})
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const { data } = await supabase.from('packages').select('id, image_url')
    if (data) {
      const map: Record<number, string> = {}
      data.forEach((pkg: any) => { if (pkg.image_url) map[pkg.id] = pkg.image_url })
      setImageUrls(map)
    }
  }

  const handleBuy = async (pkg: typeof packages[0]) => {
    setLoading(pkg.id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageName: pkg.name, price: pkg.price, packageId: pkg.id, userId: session.user.id })
      })
      const data = await res.json()
      if (data.url) {
        await supabase.from('orders').insert({ user_id: session.user.id, package_id: pkg.id, total_price: pkg.price, status: 'pending' })
        const { data: profileData } = await supabase.from('profiles').select('full_name, phone').eq('id', session.user.id).single()
        await fetch('/api/sendemail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerName: profileData?.full_name || 'Customer', customerEmail: session.user.email, customerPhone: profileData?.phone || 'N/A', packageName: pkg.name, price: pkg.price })
        })
        window.location.href = data.url
      } else {
        alert('Something went wrong: ' + JSON.stringify(data.error))
      }
    } catch (e) {
      alert('Something went wrong: ' + e)
    }
    setLoading(null)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #f59e0b; --gold-dim: rgba(245,158,11,0.1); --gold-border: rgba(245,158,11,0.2);
          --navy: #0a0f1e; --card2: #161d2e; --text: #f1f5f9; --muted: #94a3b8;
          --green: #10b981; --border: rgba(255,255,255,0.06);
        }
        html, body { overflow-x: hidden; }
        body { font-family: 'DM Sans', sans-serif; font-weight: 400; background: var(--navy); color: var(--text); }
        nav {
          background: rgba(10,15,30,0.96); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 1.1rem 3rem; display: flex; justify-content: space-between; align-items: center;
          position: sticky; top: 0; z-index: 100;
        }
        .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 0.6rem; letter-spacing: 0.03em; }
        .nav-logo-icon { width: 30px; height: 30px; background: var(--gold); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .nav-logo span { color: var(--gold); }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; }
        .nav-btn { padding: 0.5rem 1.1rem; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .nav-btn.outline { border: 1px solid var(--gold-border); background: transparent; color: var(--gold); }
        .nav-btn.outline:hover { background: var(--gold-dim); }
        .nav-btn.solid { border: none; background: var(--gold); color: var(--navy); font-weight: 600; }
        .nav-btn.solid:hover { opacity: 0.88; }
        .nav-email { font-size: 0.82rem; color: var(--muted); }
        .hero {
          text-align: center; padding: 5.5rem 2rem 3.5rem;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%);
          border-bottom: 1px solid var(--border);
        }
        .hero-label {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--gold-dim); border: 1px solid var(--gold-border);
          color: var(--gold); padding: 0.3rem 1rem; border-radius: 100px;
          font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; margin-bottom: 1.75rem; font-family: 'DM Sans', sans-serif;
        }
        .hero-title {
          font-family: 'Syne', sans-serif; font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800; letter-spacing: -1.5px; margin-bottom: 1rem; line-height: 1.08;
        }
        .hero-title span { color: var(--gold); }
        .hero-sub { color: var(--muted); font-size: 1rem; font-weight: 400; max-width: 460px; margin: 0 auto; line-height: 1.75; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; max-width: 1320px; margin: 4rem auto; padding: 0 2rem 5rem; }
        .card { background: var(--card2); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; transition: all 0.3s ease; position: relative; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.45); border-color: rgba(255,255,255,0.1); }
        .card.popular { border-color: var(--gold-border); }
        .card-img { width: 100%; height: 195px; object-fit: cover; display: block; }
        .card-img-placeholder { width: 100%; height: 195px; background: linear-gradient(135deg, #1a2540 0%, #0f172a 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: var(--muted); font-size: 0.78rem; }
        .card-img-placeholder span { font-size: 2.5rem; }
        .popular-badge { position: absolute; top: 12px; right: 12px; background: var(--gold); color: var(--navy); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.62rem; padding: 0.25rem 0.7rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.06em; }
        .card-body { padding: 1.6rem; flex: 1; display: flex; flex-direction: column; }
        .pkg-tagline { font-size: 0.68rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.3rem; font-weight: 500; }
        .pkg-name { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; letter-spacing: -0.3px; margin-bottom: 0.4rem; }
        .pkg-desc { font-size: 0.82rem; color: var(--muted); margin-bottom: 1.25rem; line-height: 1.6; }
        .pkg-price { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--gold); letter-spacing: -0.5px; margin-bottom: 0.2rem; }
        .pkg-savings { color: var(--green); font-size: 0.82rem; margin-bottom: 1.25rem; font-weight: 500; }
        .features { list-style: none; margin-bottom: 1.5rem; flex: 1; }
        .features li { font-size: 0.82rem; color: var(--muted); padding: 0.45rem 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; }
        .features li::before { content: '✓'; color: var(--gold); font-weight: 700; font-size: 0.72rem; flex-shrink: 0; }
        .buy-btn { width: 100%; padding: 0.9rem; border-radius: 10px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.88rem; letter-spacing: 0.02em; cursor: pointer; transition: all 0.2s; border: 1px solid var(--gold-border); background: transparent; color: var(--text); }
        .buy-btn:hover { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }
        .buy-btn.primary { background: var(--gold); color: var(--navy); border-color: var(--gold); }
        .buy-btn.primary:hover { opacity: 0.88; box-shadow: 0 8px 24px rgba(245,158,11,0.3); }
        .buy-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        @media (max-width: 1200px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.25rem; }
          .nav-email { display: none; }
          .hero { padding: 3.5rem 1.25rem 2.5rem; }
          .hero-title { font-size: 2rem; letter-spacing: -0.5px; }
          .grid { grid-template-columns: 1fr; padding: 0 1.25rem 3rem; margin-top: 2rem; }
        }
      `}</style>

      <nav>
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">☀️</div>
          E-<span>LAW</span> Solar
        </a>
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-email">{user.email}</span>
              <button className="nav-btn solid" onClick={() => router.push('/dashboard')}>Dashboard</button>
            </>
          ) : (
            <>
              <button className="nav-btn outline" onClick={() => router.push('/auth')}>Login</button>
              <button className="nav-btn solid" onClick={() => router.push('/auth')}>Sign Up</button>
            </>
          )}
        </div>
      </nav>

      <div className="hero">
        <div className="hero-label">☀️ Solar Packages</div>
        <h1 className="hero-title">Choose Your <span>Solar Package</span></h1>
        <p className="hero-sub">Pick the plan that fits your home and start saving on electricity today.</p>
      </div>

      <div className="grid">
        {packages.map(pkg => (
          <div key={pkg.id} className={`card ${pkg.popular ? 'popular' : ''}`}>
            {imageUrls[pkg.id] ? (
              <img src={imageUrls[pkg.id]} alt={pkg.name} className="card-img" />
            ) : (
              <div className="card-img-placeholder">
                <span>☀️</span>
                <span>Product Photo Coming Soon</span>
              </div>
            )}
            {pkg.popular && <div className="popular-badge">⭐ Most Popular</div>}
            <div className="card-body">
              <div className="pkg-tagline">{pkg.tagline}</div>
              <div className="pkg-name">{pkg.name}</div>
              <div className="pkg-desc">{pkg.description}</div>
              <div className="pkg-price">₱{pkg.price.toLocaleString()}</div>
              <div className="pkg-savings">Save ~₱{pkg.savings.toLocaleString()}/month</div>
              <ul className="features">
                {pkg.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button
                className={`buy-btn ${pkg.popular ? 'primary' : ''}`}
                onClick={() => user ? handleBuy(pkg) : router.push('/auth')}
                disabled={loading === pkg.id}
              >
                {loading === pkg.id ? 'Processing...' : user ? 'Buy Now →' : 'Login to Buy →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
