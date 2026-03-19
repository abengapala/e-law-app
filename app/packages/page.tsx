'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const packages = [
  { id: 1, name: 'Bahay Saver', price: 150000, tagline: 'Starter Package', description: 'Perfect for small homes with monthly bills of ₱4,000–₱7,000', savings: 2000, features: ['3 kW System', '6 Solar Panels', 'Basic Monitoring', '5 Year Warranty', 'Free Installation'] },
  { id: 2, name: 'Family Power', price: 250000, tagline: 'Standard Package', description: 'Ideal for average Filipino family homes with bills of ₱7,000–₱10,000', savings: 4000, features: ['5 kW System', '10 Solar Panels', 'Smart Monitoring', '10 Year Warranty', 'Free Installation'], popular: true },
  { id: 3, name: 'Home Independence', price: 420000, tagline: 'Premium Package', description: 'Full energy independence for larger homes with bills of ₱10,000–₱15,000', savings: 6000, features: ['8 kW System', '16 Solar Panels', 'Advanced Monitoring', '15 Year Warranty', 'Free Installation'] },
  { id: 4, name: 'Zero Bill', price: 550000, tagline: 'Ultimate Package', description: 'Maximum output for high-consumption homes with bills of ₱15,000+', savings: 10000, features: ['10–12 kW System', '22 Solar Panels', 'Premium Monitoring', '25 Year Warranty', 'Free Installation'] }
]

export default function PackagesPage() {
  const [loading, setLoading] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({})
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null))
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const { data } = await supabase.from('packages').select('id, image_url')
    if (data) {
      const map: Record<number, string> = {}
      data.forEach((p: any) => { if (p.image_url) map[p.id] = p.image_url })
      setImageUrls(map)
    }
  }

  const handleBuy = async (pkg: typeof packages[0]) => {
    setLoading(pkg.id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packageName: pkg.name, price: pkg.price, packageId: pkg.id, userId: session.user.id }) })
      const data = await res.json()
      if (data.url) {
        await supabase.from('orders').insert({ user_id: session.user.id, package_id: pkg.id, total_price: pkg.price, status: 'pending' })
        const { data: profileData } = await supabase.from('profiles').select('full_name, phone').eq('id', session.user.id).single()
        await fetch('/api/sendemail', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerName: profileData?.full_name || 'Customer', customerEmail: session.user.email, customerPhone: profileData?.phone || 'N/A', packageName: pkg.name, price: pkg.price }) })
        window.location.href = data.url
      } else { alert('Something went wrong: ' + JSON.stringify(data.error)) }
    } catch (e) { alert('Something went wrong: ' + e) }
    setLoading(null)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; }
        body { font-family: 'DM Sans', sans-serif; background: #0E1C29; color: #fff; }
        nav { background: rgba(14,28,41,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 1.1rem 3rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .nav-logo { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 0.6rem; letter-spacing: 0.02em; }
        .nav-logo-icon { width: 28px; height: 28px; background: #1AA3DE; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; }
        .nav-btn { padding: 0.5rem 1.1rem; border-radius: 5px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.83rem; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; border: none; }
        .nav-btn.outline { border: 1px solid rgba(26,163,222,0.3); background: transparent; color: #1AA3DE; }
        .nav-btn.outline:hover { background: rgba(26,163,222,0.08); }
        .nav-btn.solid { background: #1AA3DE; color: #fff; }
        .nav-btn.solid:hover { background: #1591c7; }
        .nav-email { font-size: 0.78rem; color: rgba(255,255,255,0.4); }
        .hero { text-align: center; padding: 5rem 2rem 3.5rem; background: linear-gradient(180deg, rgba(14,28,41,0) 0%, #0E1C29 100%), url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=80') center/cover no-repeat; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .hero-eyebrow { font-size: 0.68rem; color: rgba(255,255,255,0.4); font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.85rem; font-family: 'DM Sans', sans-serif; }
        .hero-title { font-family: 'Inter', sans-serif; font-size: clamp(1.6rem, 3vw, 2.6rem); font-weight: 300; line-height: 1.1; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 0.75rem; color: #fff; }
        .hero-sub { color: rgba(255,255,255,0.5); font-size: 0.85rem; font-weight: 400; max-width: 440px; margin: 0 auto; line-height: 1.75; font-family: 'DM Sans', sans-serif; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; max-width: 1200px; margin: 3.5rem auto; padding: 0 2rem 5rem; }
        .card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; overflow: hidden; transition: all 0.3s; position: relative; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-4px); border-color: rgba(26,163,222,0.25); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .card.popular { border-color: rgba(26,163,222,0.35); }
        .card-img { width: 100%; height: 170px; object-fit: cover; display: block; }
        .card-img-placeholder { width: 100%; height: 170px; background: linear-gradient(135deg, #1a2f3f, #0e1c29); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; color: rgba(255,255,255,0.25); font-size: 0.72rem; font-family: 'DM Sans', sans-serif; }
        .card-img-placeholder span { font-size: 2rem; }
        .popular-badge { position: absolute; top: 10px; right: 10px; background: #1AA3DE; color: #fff; font-size: 0.58rem; font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.08em; font-family: 'DM Sans', sans-serif; }
        .card-body { padding: 1.1rem 1.25rem; flex: 1; display: flex; flex-direction: column; }
        .pkg-tagline { font-size: 0.62rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.2rem; font-family: 'DM Sans', sans-serif; }
        .pkg-name { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem; letter-spacing: 0.02em; }
        .pkg-desc { font-size: 0.78rem; color: rgba(255,255,255,0.45); margin-bottom: 1rem; line-height: 1.6; font-family: 'DM Sans', sans-serif; }
        .pkg-price { font-family: 'DM Sans', sans-serif; font-size: 1.2rem; font-weight: 500; color: #1AA3DE; margin-bottom: 0.25rem; }
        .pkg-savings { color: rgba(255,255,255,0.5); font-size: 0.75rem; margin-bottom: 1rem; font-family: 'DM Sans', sans-serif; }
        .features { list-style: none; margin-bottom: 1.25rem; flex: 1; }
        .features li { font-size: 0.78rem; color: rgba(255,255,255,0.5); padding: 0.38rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 0.45rem; font-family: 'DM Sans', sans-serif; }
        .features li::before { content: '✓'; color: #1AA3DE; font-size: 0.68rem; flex-shrink: 0; font-weight: 600; }
        .buy-btn { width: 100%; padding: 0.7rem; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(26,163,222,0.25); background: transparent; color: rgba(255,255,255,0.7); }
        .buy-btn:hover { border-color: #1AA3DE; color: #1AA3DE; }
        .buy-btn.primary { background: #1AA3DE; color: #fff; border-color: #1AA3DE; }
        .buy-btn.primary:hover { background: #1591c7; }
        .buy-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        @media (max-width: 1200px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.25rem; }
          .nav-email { display: none; }
          .hero { padding: 3.5rem 1.25rem 2.5rem; }
          .hero-title { font-size: 1.5rem; letter-spacing: 2px; }
          .grid { grid-template-columns: 1fr; padding: 0 1.25rem 3rem; margin-top: 2rem; }
        }
      `}</style>

      <nav>
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">☀️</div>
  
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
        <div className="hero-eyebrow">E-LAW Solar — Metro Manila & NCR</div>
        <h1 className="hero-title">Choose Your Solar Package</h1>
        <p className="hero-sub">Pick the plan that fits your home and start saving on electricity today. Free installation included.</p>
      </div>

      <div className="grid">
        {packages.map(pkg => (
          <div key={pkg.id} className={`card ${pkg.popular ? 'popular' : ''}`}>
            {imageUrls[pkg.id] ? (
              <img src={imageUrls[pkg.id]} alt={pkg.name} className="card-img" />
            ) : (
              <div className="card-img-placeholder">
                <span>☀️</span>
                <span>Product Photo</span>
              </div>
            )}
            {pkg.popular && <div className="popular-badge">Most Popular</div>}
            <div className="card-body">
              <div className="pkg-tagline">{pkg.tagline}</div>
              <div className="pkg-name">{pkg.name}</div>
              <div className="pkg-desc">{pkg.description}</div>
              <div className="pkg-price">₱{pkg.price.toLocaleString()}+</div>
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
