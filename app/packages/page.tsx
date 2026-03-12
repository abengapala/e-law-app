'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const packages = [
  {
    id: 1,
    name: 'Bahay Saver',
    price: 45000,
    description: 'Perfect starter package for small homes',
    savings: 800,
    recommended: 2000,
    features: ['3 Solar Panels', '1.5kW Capacity', 'Basic Monitoring', '5 Year Warranty']
  },
  {
    id: 2,
    name: 'Family Power',
    price: 85000,
    description: 'Ideal for average Filipino family homes',
    savings: 1500,
    recommended: 4000,
    features: ['6 Solar Panels', '3kW Capacity', 'Smart Monitoring', '10 Year Warranty'],
    popular: true
  },
  {
    id: 3,
    name: 'Home Independence',
    price: 130000,
    description: 'Full energy independence for larger homes',
    savings: 2500,
    recommended: 6000,
    features: ['9 Solar Panels', '5kW Capacity', 'Advanced Monitoring', '15 Year Warranty']
  },
  {
    id: 4,
    name: 'Zero Bill',
    price: 180000,
    description: 'Maximum output, zero electricity bill guaranteed',
    savings: 3500,
    recommended: 8000,
    features: ['12 Solar Panels', '8kW Capacity', 'Premium Monitoring', '20 Year Warranty']
  }
]

export default function PackagesPage() {
  const [loading, setLoading] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })
  }, [])

  const handleBuy = async (pkg: typeof packages[0]) => {
    setLoading(pkg.id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: pkg.name,
          price: pkg.price,
          packageId: pkg.id,
          userId: session.user.id
        })
      })
      const data = await res.json()
      if (data.url) {
        await supabase.from('orders').insert({
          user_id: session.user.id,
          package_id: pkg.id,
          total_price: pkg.price,
          status: 'pending'
        })
        // Send email notification
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', session.user.id)
          .single()

        await fetch('/api/sendemail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: profileData?.full_name || 'Customer',
            customerEmail: session.user.email,
            customerPhone: profileData?.phone || 'N/A',
            packageName: pkg.name,
            price: pkg.price
          })
        })

        window.location.href = data.url
      } else {
        console.error('Checkout error:', data)
        alert('Something went wrong: ' + JSON.stringify(data.error))
      }
    } catch (e) {
      console.error('Catch error:', e)
      alert('Something went wrong: ' + e)
    }
    setLoading(null)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0f1e; color: #e2e8f0; }
        .nav {
          background: #161d2e; border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;
        }
        .logo { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: #f59e0b; cursor: pointer; }
        .nav-links { display: flex; gap: 1rem; align-items: center; }
        .nav-btn {
          padding: 0.5rem 1rem; border-radius: 8px; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
        }
        .nav-btn.outline { border: 1px solid rgba(245,158,11,0.3); background: transparent; color: #f59e0b; }
        .nav-btn.outline:hover { background: rgba(245,158,11,0.1); }
        .nav-btn.solid { border: none; background: #f59e0b; color: #0a0f1e; }
        .nav-btn.solid:hover { opacity: 0.85; }
        .user-email { font-size: 0.85rem; color: #94a3b8; }
        .hero { text-align: center; padding: 4rem 1.5rem 2rem; }
        .hero-title { font-family: 'Syne', sans-serif; font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
        .hero-title span { color: #f59e0b; }
        .hero-sub { color: #94a3b8; font-size: 1rem; max-width: 500px; margin: 0 auto; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 3rem auto; padding: 0 1.5rem 4rem; }
        .card {
          background: #161d2e; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 2rem; position: relative; transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-4px); }
        .card.popular { border-color: #f59e0b; }
        .popular-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: #f59e0b; color: #0a0f1e; font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 0.75rem; padding: 0.25rem 1rem; border-radius: 99px;
        }
        .pkg-name { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; }
        .pkg-desc { color: #94a3b8; font-size: 0.85rem; margin-bottom: 1.5rem; }
        .pkg-price { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #f59e0b; margin-bottom: 0.25rem; }
        .pkg-savings { color: #6ee7b7; font-size: 0.85rem; margin-bottom: 1.5rem; }
        .features { list-style: none; margin-bottom: 2rem; }
        .features li { font-size: 0.85rem; color: #94a3b8; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .features li::before { content: '✓ '; color: #f59e0b; font-weight: 700; }
        .buy-btn {
          width: 100%; padding: 0.875rem; border-radius: 10px; border: none;
          background: #f59e0b; color: #0a0f1e; font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: opacity 0.2s;
        }
        .buy-btn:hover { opacity: 0.85; }
        .buy-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .buy-btn.outline-btn {
          background: transparent; border: 1px solid rgba(245,158,11,0.3); color: #f59e0b;
        }
        .buy-btn.outline-btn:hover { background: rgba(245,158,11,0.1); }
        @media (max-width: 768px) {
          .nav { padding: 1rem; }
          .hero { padding: 2rem 1rem 1rem; }
          .hero-title { font-size: 1.75rem; }
          .grid { grid-template-columns: 1fr; padding: 0 1rem 2rem; margin-top: 1.5rem; }
          .nav-links { gap: 0.5rem; }
          .user-email { display: none; }
        }
      `}</style>

      <nav className="nav">
        <div className="logo" onClick={() => router.push('/')}>☀️ E-LAW Solar</div>
        <div className="nav-links">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
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
        <h1 className="hero-title">Choose Your <span>Solar Package</span></h1>
        <p className="hero-sub">Pick the plan that fits your home and start saving on electricity today.</p>
      </div>

      <div className="grid">
        {packages.map(pkg => (
          <div key={pkg.id} className={`card ${pkg.popular ? 'popular' : ''}`}>
            {pkg.popular && <div className="popular-badge">⭐ Most Popular</div>}
            <div className="pkg-name">{pkg.name}</div>
            <div className="pkg-desc">{pkg.description}</div>
            <div className="pkg-price">₱{pkg.price.toLocaleString()}</div>
            <div className="pkg-savings">Save ~₱{pkg.savings.toLocaleString()}/month</div>
            <ul className="features">
              {pkg.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <button
              className={`buy-btn ${pkg.popular ? '' : 'outline-btn'}`}
              onClick={() => user ? handleBuy(pkg) : router.push('/auth')}
              disabled={loading === pkg.id}
            >
              {loading === pkg.id ? 'Processing...' : user ? 'Buy Now →' : 'Login to Buy →'}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}