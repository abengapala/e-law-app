'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Package {
  name: string
  tagline: string
  size: string
  panels: number
  bill: string
  savings: string
  price: string
  payback: string
  total: string
  color: string
  minBill: number
  maxBill: number
  popular?: boolean
}

export default function Home() {
  const [bill, setBill] = useState('')
  const [recommended, setRecommended] = useState<Package | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const packages: Package[] = [
    {
      name: 'Bahay Saver', tagline: 'Starter Package', size: '3 kW', panels: 12,
      bill: '₱4,000 – ₱6,000', savings: '₱2,000 – ₱3,500', price: '₱180,000',
      payback: '4–5 years', total: '₱1,050,000', color: '#f59e0b', minBill: 4000, maxBill: 6999,
    },
    {
      name: 'Family Power', tagline: 'Standard Package', size: '5 kW', panels: 20,
      bill: '₱7,000 – ₱10,000', savings: '₱4,000 – ₱6,000', price: '₱280,000',
      payback: '4–5 years', total: '₱1,800,000', color: '#10b981', minBill: 7000, maxBill: 9999, popular: true,
    },
    {
      name: 'Home Independence', tagline: 'Premium Package', size: '8 kW', panels: 32,
      bill: '₱10,000 – ₱15,000', savings: '₱6,000 – ₱10,000', price: '₱420,000',
      payback: '3.5–4.5 years', total: '₱3,000,000', color: '#3b82f6', minBill: 10000, maxBill: 14999,
    },
    {
      name: 'Zero Bill', tagline: 'Ultimate Package', size: '10–12 kW', panels: 48,
      bill: '₱15,000+', savings: '₱10,000 – ₱15,000', price: '₱550,000 – ₱700,000',
      payback: '3–4 years', total: '₱4,500,000', color: '#8b5cf6', minBill: 15000, maxBill: Infinity,
    },
  ]

  const calculatePackage = () => {
    const amount = parseInt(bill.replace(/,/g, ''))
    if (!amount) return
    const match = packages.find((p) => amount >= p.minBill && amount <= p.maxBill)
    setRecommended(match || packages[3])
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sun: #f59e0b; --sun-light: #fef3c7; --dark: #0a0f1e; --dark2: #111827;
          --card: #161d2e; --text: #e2e8f0; --muted: #94a3b8; --green: #10b981;
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: var(--dark); color: var(--text); overflow-x: hidden; }
        h1, h2, h3, h4 { font-family: 'Syne', sans-serif; }
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.25rem 2rem; display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s ease;
        }
        nav.scrolled {
          background: rgba(10,15,30,0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(245,158,11,0.15); padding: 1rem 2rem;
        }
        .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; color: var(--sun); text-decoration: none; letter-spacing: -0.5px; }
        .nav-logo span { color: var(--text); }
        .nav-links { display: flex; gap: 2rem; align-items: center; }
        .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
        .nav-links a:hover { color: var(--text); }
        .nav-cta { background: var(--sun); color: var(--dark) !important; padding: 0.5rem 1.25rem; border-radius: 6px; font-weight: 700 !important; font-size: 0.85rem !important; transition: opacity 0.2s !important; }
        .nav-cta:hover { opacity: 0.85; }
        .nav-email { font-size: 0.8rem; color: var(--muted); }
        .hero { min-height: 100vh; display: flex; align-items: center; padding: 8rem 2rem 4rem; position: relative; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 80% 60% at 60% 30%, rgba(245,158,11,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 70%, rgba(16,185,129,0.06) 0%, transparent 60%); }
        .hero-grid { position: absolute; inset: 0; z-index: 0; background-image: linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px); background-size: 60px 60px; }
        .hero-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); color: var(--sun); padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .hero-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.1; letter-spacing: -1px; margin-bottom: 1.5rem; }
        .hero-title .accent { color: var(--sun); }
        .hero-desc { font-size: 1.1rem; color: var(--muted); line-height: 1.7; margin-bottom: 2rem; max-width: 480px; }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary { background: var(--sun); color: var(--dark); padding: 0.875rem 2rem; border-radius: 8px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(245,158,11,0.35); }
        .btn-secondary { background: transparent; color: var(--text); padding: 0.875rem 2rem; border-radius: 8px; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.95rem; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-secondary:hover { border-color: var(--sun); color: var(--sun); }
        .hero-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .stat-card { background: var(--card); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; transition: border-color 0.2s; }
        .stat-card:hover { border-color: rgba(245,158,11,0.3); }
        .stat-number { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--sun); line-height: 1; margin-bottom: 0.4rem; }
        .stat-label { font-size: 0.85rem; color: var(--muted); line-height: 1.4; }
        section { padding: 6rem 2rem; }
        .container { max-width: 1200px; margin: 0 auto; }
        .section-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--sun); margin-bottom: 1rem; }
        .section-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; letter-spacing: -0.5px; margin-bottom: 1rem; line-height: 1.2; }
        .section-desc { font-size: 1.05rem; color: var(--muted); max-width: 560px; line-height: 1.7; }
        .packages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
        .package-card { background: var(--card); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 2rem; position: relative; overflow: hidden; transition: all 0.3s ease; cursor: pointer; }
        .package-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.15); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .package-card.popular { border-color: rgba(16,185,129,0.4); }
        .popular-badge { position: absolute; top: 1rem; right: 1rem; background: var(--green); color: white; font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.05em; }
        .package-accent { width: 40px; height: 4px; border-radius: 2px; margin-bottom: 1.5rem; }
        .package-tagline { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; }
        .package-name { font-size: 1.4rem; font-weight: 800; margin-bottom: 1.25rem; }
        .package-size { font-size: 2.5rem; font-weight: 800; font-family: 'Syne', sans-serif; line-height: 1; margin-bottom: 0.25rem; }
        .package-panels { font-size: 0.8rem; color: var(--muted); margin-bottom: 1.5rem; }
        .package-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 1.25rem 0; }
        .package-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
        .package-row-label { font-size: 0.8rem; color: var(--muted); }
        .package-row-value { font-size: 0.85rem; font-weight: 600; }
        .package-price { font-size: 1.5rem; font-weight: 800; font-family: 'Syne', sans-serif; margin-top: 1.25rem; }
        .package-btn { width: 100%; margin-top: 1.25rem; padding: 0.75rem; border-radius: 8px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: transparent; color: var(--text); transition: all 0.2s; text-decoration: none; display: block; text-align: center; }
        .package-btn:hover { background: rgba(255,255,255,0.06); }
        .calc-section { background: var(--dark2); }
        .calc-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .calc-box { background: var(--card); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2.5rem; }
        .calc-label { font-size: 0.85rem; color: var(--muted); margin-bottom: 0.6rem; display: block; }
        .calc-input { width: 100%; padding: 1rem 1.25rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 1.1rem; outline: none; transition: border-color 0.2s; margin-bottom: 1.25rem; }
        .calc-input:focus { border-color: var(--sun); }
        .calc-result { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); border-radius: 12px; padding: 1.5rem; margin-top: 1.25rem; }
        .calc-result-label { font-size: 0.75rem; color: var(--sun); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
        .calc-result-name { font-size: 1.4rem; font-weight: 800; margin-bottom: 0.25rem; }
        .calc-result-desc { font-size: 0.85rem; color: var(--muted); }
        .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
        .why-card { background: var(--card); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.75rem; transition: border-color 0.2s; }
        .why-card:hover { border-color: rgba(245,158,11,0.25); }
        .why-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(245,158,11,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 1rem; }
        .why-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .why-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }
        .cta-section { background: linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(16,185,129,0.06) 100%); border-top: 1px solid rgba(245,158,11,0.1); border-bottom: 1px solid rgba(245,158,11,0.1); text-align: center; }
        .cta-section .section-desc { margin: 0 auto 2rem; }
        .cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        footer { background: var(--dark2); border-top: 1px solid rgba(255,255,255,0.06); padding: 3rem 2rem; }
        .footer-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.3rem; color: var(--sun); }
        .footer-info { font-size: 0.8rem; color: var(--muted); line-height: 1.7; }
        .footer-tagline { font-size: 0.8rem; color: var(--muted); font-style: italic; }
        @media (max-width: 768px) {
          .hero-content, .calc-inner { grid-template-columns: 1fr; gap: 2rem; }
          .nav-links { display: flex; gap: 0.5rem; flex-wrap: wrap; }
          .nav-links a { font-size: 0.75rem; }
          nav { padding: 1rem; }
          .hero { padding: 5rem 1rem 2rem; }
          .hero-title { font-size: 2rem; }
          section { padding: 3rem 1rem; }
          .packages-grid { grid-template-columns: 1fr; }
          .why-grid { grid-template-columns: 1fr; }
          .cta-actions { flex-direction: column; align-items: center; }
          .footer-inner { flex-direction: column; text-align: center; }
          .hero-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <nav className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">E-<span>LAW</span></a>
        <div className="nav-links">
          <a href="#packages">Packages</a>
          <a href="#calculator">Calculator</a>
          <a href="#why">Why E-LAW</a>
          {user ? (
            <>
              <span className="nav-email">{user.email}</span>
              <a href="/dashboard" className="nav-cta">Dashboard</a>
            </>
          ) : (
            <>
              <a href="/auth">Login</a>
              <a href="#contact" className="nav-cta">Get Free Quote</a>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div>
            <div className="hero-badge">🌞 Residential Solar — Metro Manila</div>
            <h1 className="hero-title">Cut Your <span className="accent">Electricity Bill</span> by Up to 90%</h1>
            <p className="hero-desc">E-LAW brings affordable solar energy to Filipino urban families. Stop overpaying MERALCO — start saving ₱2,000 to ₱15,000 every month.</p>
            <div className="hero-actions">
              <a href="#calculator" className="btn-primary">Calculate My Savings</a>
              <a href="/packages" className="btn-secondary">View Packages</a>
            </div>
          </div>
          <div className="hero-stats">
            {[
              { number: '50–90%', label: 'Reduction in electricity bills' },
              { number: '25 yrs', label: 'Solar panel performance warranty' },
              { number: '3–5 yrs', label: 'Average payback period' },
              { number: '10,000', label: 'Filipino homes by 2030' },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="packages">
        <div className="container">
          <div className="section-label">Solar Packages</div>
          <h2 className="section-title">Find the Right System for Your Home</h2>
          <p className="section-desc">Four complete packages designed for every Filipino household.</p>
          <div className="packages-grid">
            {packages.map((pkg, i) => (
              <div className={`package-card${pkg.popular ? ' popular' : ''}`} key={i}>
                {pkg.popular && <div className="popular-badge">Most Popular</div>}
                <div className="package-accent" style={{ background: pkg.color }} />
                <div className="package-tagline">{pkg.tagline}</div>
                <div className="package-name">{pkg.name}</div>
                <div className="package-size" style={{ color: pkg.color }}>{pkg.size}</div>
                <div className="package-panels">{pkg.panels} solar panels</div>
                <hr className="package-divider" />
                <div className="package-row">
                  <span className="package-row-label">Monthly Bill</span>
                  <span className="package-row-value">{pkg.bill}</span>
                </div>
                <div className="package-row">
                  <span className="package-row-label">Monthly Savings</span>
                  <span className="package-row-value" style={{ color: '#10b981' }}>{pkg.savings}</span>
                </div>
                <div className="package-row">
                  <span className="package-row-label">Payback Period</span>
                  <span className="package-row-value">{pkg.payback}</span>
                </div>
                <div className="package-row">
                  <span className="package-row-label">25-yr Total Savings</span>
                  <span className="package-row-value" style={{ color: pkg.color }}>{pkg.total}</span>
                </div>
                <div className="package-price">{pkg.price}</div>
                <a href="/packages" className="package-btn">Buy Now →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="calc-section">
        <div className="container">
          <div className="calc-inner">
            <div>
              <div className="section-label">Savings Calculator</div>
              <h2 className="section-title">How Much Can You Save?</h2>
              <p className="section-desc">Enter your average monthly MERALCO bill and we'll recommend the best solar package for your home.</p>
            </div>
            <div className="calc-box">
              <label className="calc-label">Your average monthly electricity bill (₱)</label>
              <input className="calc-input" type="number" placeholder="e.g. 8500" value={bill}
                onChange={(e) => { setBill(e.target.value); setRecommended(null) }} />
              <button className="btn-primary" style={{ width: '100%' }} onClick={calculatePackage}>Find My Package →</button>
              {recommended && (
                <div className="calc-result">
                  <div className="calc-result-label">✅ Recommended for you</div>
                  <div className="calc-result-name" style={{ color: recommended.color }}>{recommended.name}</div>
                  <div className="calc-result-desc">{recommended.size} system · Save {recommended.savings}/month · Invest {recommended.price}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="why">
        <div className="container">
          <div className="section-label">Why E-LAW</div>
          <h2 className="section-title">Solar Built for Filipino Families</h2>
          <div className="why-grid">
            {[
              { icon: '🇵🇭', title: 'Filipino-First', desc: 'Tagalog & English support. We understand the unique challenges of Filipino urban homeowners.' },
              { icon: '💸', title: 'Flexible Payment', desc: '0% installment, bank financing, rent-to-own. We work with your budget.' },
              { icon: '🔍', title: 'Full Transparency', desc: 'No hidden fees. Clear ROI calculations and honest assessments before you commit.' },
              { icon: '⭐', title: 'Tier 1 Quality', desc: 'Top-grade solar panels with 25-year performance warranty and certified installers.' },
              { icon: '📱', title: 'Free Monitoring App', desc: 'Track your savings in real-time with our lifetime-free mobile monitoring system.' },
              { icon: '🔧', title: 'Lifetime Support', desc: "From free consultation to installation to maintenance — we're with you every step." },
            ].map((w, i) => (
              <div className="why-card" key={i}>
                <div className="why-icon">{w.icon}</div>
                <div className="why-title">{w.title}</div>
                <div className="why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="cta-section">
        <div className="container">
          <div className="section-label">Get Started Today</div>
          <h2 className="section-title">Ready to Stop Overpaying for Electricity?</h2>
          <p className="section-desc">Book a free home consultation. No obligation.</p>
          <div className="cta-actions">
            <a href="https://m.me/elawsolar" className="btn-primary">💬 Message Us on Facebook</a>
            <a href="tel:09560641174" className="btn-secondary">📞 Call 0956 064 1174</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-logo">E-LAW Solar</div>
            <div className="footer-info">
              #20 Freedom Park, Batasan Hills, Quezon City 1126<br />
              e-lawsolar@gmail.com · 09560641174
            </div>
          </div>
          <div className="footer-tagline">"Sa E-LAW, ang araw ay para sa lahat."</div>
        </div>
      </footer>
    </>
  )
}