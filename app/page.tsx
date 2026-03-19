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
  const [menuOpen, setMenuOpen] = useState(false)

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
      payback: '4–5 years', total: '₱1,050,000', color: '#1AA3DE', minBill: 4000, maxBill: 6999,
    },
    {
      name: 'Family Power', tagline: 'Standard Package', size: '5 kW', panels: 20,
      bill: '₱7,000 – ₱10,000', savings: '₱4,000 – ₱6,000', price: '₱280,000',
      payback: '4–5 years', total: '₱1,800,000', color: '#1AA3DE', minBill: 7000, maxBill: 9999, popular: true,
    },
    {
      name: 'Home Independence', tagline: 'Premium Package', size: '8 kW', panels: 32,
      bill: '₱10,000 – ₱15,000', savings: '₱6,000 – ₱10,000', price: '₱420,000',
      payback: '3.5–4.5 years', total: '₱3,000,000', color: '#1AA3DE', minBill: 10000, maxBill: 14999,
    },
    {
      name: 'Zero Bill', tagline: 'Ultimate Package', size: '10–12 kW', panels: 48,
      bill: '₱15,000+', savings: '₱10,000 – ₱15,000', price: '₱550,000 – ₱700,000',
      payback: '3–4 years', total: '₱4,500,000', color: '#1AA3DE', minBill: 15000, maxBill: Infinity,
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; overflow-x: hidden; }
        body { font-family: 'DM Sans', sans-serif; background: #0E1C29; color: #fff; overflow-x: hidden; }

        /* NAV */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 1.25rem 3rem;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s ease;
        }
        nav.scrolled {
          background: rgba(14,28,41,0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .nav-logo {
          font-family: 'Bebas Neue', sans-serif; font-weight: 800; font-size: 1.3rem;
          color: #fff; text-decoration: none; display: flex; align-items: center; gap: 0.6rem;
        }
        .nav-logo-icon { width: 30px; height: 30px; background: #1AA3DE; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .nav-center { display: flex; gap: 2.5rem; align-items: center; }
        .nav-center a { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.88rem; font-weight: 400; transition: color 0.2s; }
        .nav-center a:hover { color: #fff; }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .nav-cta {
          background: #1AA3DE; color: #fff;
          padding: 0.5rem 1.35rem; border-radius: 6px;
          font-weight: 600; font-size: 0.85rem; text-decoration: none;
          transition: all 0.2s; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .nav-cta:hover { background: #1591c7; }
        .nav-login { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.88rem; transition: color 0.2s; }
        .nav-login:hover { color: #fff; }
        .nav-mobile-btn { display: none; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }

        /* MOBILE MENU */
        .mobile-menu { display: none; position: fixed; inset: 0; z-index: 999; background: rgba(14,28,41,0.99); backdrop-filter: blur(20px); flex-direction: column; align-items: center; justify-content: center; gap: 2rem; }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; text-decoration: none; }
        .mobile-menu-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; }

        /* HERO */
        .hero {
          min-height: 100vh;
          background: linear-gradient(180deg, rgba(14,28,41,0.55) 0%, rgba(14,28,41,0.8) 55%, #0E1C29 100%),
            url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=80') center/cover no-repeat;
          display: flex; align-items: flex-end; padding: 0 3rem 5rem;
          position: relative;
        }
        .hero-inner { max-width: 1100px; margin: 0 auto; width: 100%; padding-top: 9rem; }
        .hero-eyebrow { font-size: 0.75rem; color: #1AA3DE; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; }
       .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4rem, 9vw, 8rem);
          font-weight: 400;
          line-height: 0.95;
          letter-spacing: 4px;
          margin-bottom: 1.25rem;
          max-width: 800px; color: #fff;
        }
        .hero-sub { font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.75; max-width: 500px; margin-bottom: 2.5rem; font-weight: 400; }
        .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary { background: #1AA3DE; color: #fff; padding: 0.85rem 2rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; border: none; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-primary:hover { background: #1591c7; transform: translateY(-1px); }
        .btn-ghost { background: transparent; color: #fff; padding: 0.85rem 2rem; border-radius: 6px; font-weight: 500; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.25); cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.5); }

        /* SOLUTIONS SECTION */
        .solutions { background: #0E1C29; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .solutions-inner { max-width: 1100px; margin: 0 auto; }
        .sec-eyebrow { font-size: 0.72rem; color: rgba(255,255,255,0.4); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem; }
        .sec-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; color: #fff; margin-bottom: 3rem; letter-spacing: -0.3px; }
        .solutions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5rem; }
        .solution-item { }
        .solution-title { font-family: 'Bebas Neue', sans-serif; font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; }
        .solution-desc { font-size: 0.82rem; color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: 1rem; font-weight: 400; }
        .solution-link { font-size: 0.8rem; color: #1AA3DE; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 0.35rem; transition: gap 0.2s; }
        .solution-link:hover { gap: 0.6rem; }

        /* WHY US */
        .why-sec { background: #0a1520; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .why-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .why-content {}
        .why-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: #fff; margin-bottom: 0.5rem; line-height: 1.2; letter-spacing: -0.3px; }
        .why-subtitle { font-size: 0.78rem; color: rgba(255,255,255,0.4); letter-spacing: 0.05em; margin-bottom: 1.5rem; }
        .why-text { font-size: 0.85rem; color: rgba(255,255,255,0.55); line-height: 1.8; margin-bottom: 1.75rem; font-weight: 400; }
        .why-link { font-size: 0.82rem; color: #1AA3DE; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 0.35rem; transition: gap 0.2s; width: fit-content; }
        .why-link:hover { gap: 0.6rem; }
        .why-img { border-radius: 12px; overflow: hidden; height: 320px; background: #1a2f3f; }
        .why-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* PACKAGES */
        .packages-sec { background: #0E1C29; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .packages-inner { max-width: 1100px; margin: 0 auto; }
        .packages-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-top: 3rem; }
        .pkg-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; overflow: hidden; transition: all 0.3s; position: relative; }
        .pkg-card:hover { transform: translateY(-4px); border-color: rgba(26,163,222,0.3); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .pkg-card.popular { border-color: rgba(26,163,222,0.4); }
        .pkg-img { width: 100%; height: 160px; object-fit: cover; display: block; }
        .pkg-img-placeholder { width: 100%; height: 160px; background: linear-gradient(135deg, #1a2f3f, #0e1c29); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; color: rgba(255,255,255,0.3); font-size: 0.75rem; }
        .pkg-img-placeholder span { font-size: 2rem; }
        .popular-badge { position: absolute; top: 10px; right: 10px; background: #1AA3DE; color: #fff; font-size: 0.6rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.06em; font-family: 'Bebas Neue', sans-serif; }
        .pkg-body { padding: 1.25rem; }
        .pkg-tagline { font-size: 0.65rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.25rem; }
        .pkg-name { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; letter-spacing: -0.2px; }
        .pkg-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0.75rem 0; }
        .pkg-row { display: flex; justify-content: space-between; margin-bottom: 0.4rem; }
        .pkg-row-lbl { font-size: 0.75rem; color: rgba(255,255,255,0.45); }
        .pkg-row-val { font-size: 0.78rem; font-weight: 600; color: #fff; }
        .pkg-price { font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem; font-weight: 800; color: #1AA3DE; margin: 0.85rem 0; letter-spacing: -0.3px; }
        .pkg-btn { width: 100%; padding: 0.7rem; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(26,163,222,0.3); background: transparent; color: rgba(255,255,255,0.8); }
        .pkg-btn:hover { border-color: #1AA3DE; color: #1AA3DE; }
        .pkg-btn.primary { background: #1AA3DE; color: #fff; border-color: #1AA3DE; }
        .pkg-btn.primary:hover { background: #1591c7; }
        .pkg-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* CALCULATOR */
        .calc-sec { background: #0a1520; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .calc-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .calc-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 2rem; }
        .calc-lbl { font-size: 0.8rem; color: rgba(255,255,255,0.55); margin-bottom: 0.5rem; display: block; }
        .calc-input { width: 100%; padding: 0.875rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; transition: border-color 0.2s; margin-bottom: 1rem; }
        .calc-input:focus { border-color: #1AA3DE; }
        .calc-input::placeholder { color: rgba(255,255,255,0.25); }
        .calc-result { background: rgba(26,163,222,0.08); border: 1px solid rgba(26,163,222,0.2); border-radius: 10px; padding: 1.25rem; margin-top: 1rem; }
        .calc-result-label { font-size: 0.7rem; color: #1AA3DE; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.35rem; }
        .calc-result-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem; }
        .calc-result-desc { font-size: 0.8rem; color: rgba(255,255,255,0.5); }

        /* STATS */
        .stats-sec { background: #132030; padding: 3.5rem 3rem; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .stats-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center; }
        .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; font-weight: 800; color: #1AA3DE; margin-bottom: 0.25rem; }
        .stat-lbl { font-size: 0.8rem; color: rgba(255,255,255,0.5); font-weight: 400; }

        /* CTA */
        .cta-sec { background: #0E1C29; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
        .cta-inner { max-width: 600px; margin: 0 auto; }
        .cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; color: #fff; margin-bottom: 1rem; letter-spacing: -0.3px; }
        .cta-desc { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 2rem; }
        .cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        /* FOOTER */
        footer { background: #070e16; border-top: 1px solid rgba(255,255,255,0.06); padding: 4rem 3rem 2rem; }
        .footer-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .footer-desc { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.75; max-width: 240px; margin-top: 1rem; }
        .footer-col-title { font-family: 'Bebas Neue', sans-serif; font-weight: 700; font-size: 0.82rem; color: #fff; margin-bottom: 1.25rem; letter-spacing: 0.03em; }
        .footer-links { display: flex; flex-direction: column; gap: 0.6rem; }
        .footer-links a { font-size: 0.8rem; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: #1AA3DE; }
        .footer-bottom { max-width: 1100px; margin: 2rem auto 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-copy { font-size: 0.78rem; color: rgba(255,255,255,0.3); }
        .footer-tagline { font-size: 0.78rem; color: rgba(255,255,255,0.3); font-style: italic; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .solutions-grid { grid-template-columns: repeat(2, 1fr); }
          .packages-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.25rem; }
          .nav-center, .nav-right { display: none; }
          .nav-mobile-btn { display: block; }
          .hero { padding: 0 1.25rem 4rem; }
          .hero-inner { padding-top: 7rem; }
          .hero-title { font-size: 2rem; }
          .solutions { padding: 4rem 1.25rem; }
          .solutions-grid { grid-template-columns: 1fr; gap: 2rem; }
          .why-sec, .calc-sec, .packages-sec, .cta-sec { padding: 4rem 1.25rem; }
          .why-inner, .calc-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .why-img { height: 220px; }
          .packages-grid { grid-template-columns: 1fr; }
          .stats-sec { padding: 2.5rem 1.25rem; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
          .cta-btns { flex-direction: column; align-items: stretch; }
          .btn-primary, .btn-ghost { text-align: center; }
          .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; text-align: center; }
          footer { padding: 3rem 1.25rem 1.5rem; }
          .hero-btns { flex-direction: column; }
        }
      `}</style>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        <a href="#packages" onClick={() => setMenuOpen(false)}>Packages</a>
        <a href="#solutions" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="#why" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        {user ? (
          <a href="/dashboard" className="btn-primary" onClick={() => setMenuOpen(false)}>Dashboard</a>
        ) : (
          <>
            <a href="/auth" onClick={() => setMenuOpen(false)}>Login</a>
            <a href="#contact" className="btn-primary" onClick={() => setMenuOpen(false)}>Get Free Quote</a>
          </>
        )}
      </div>

      {/* NAV */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">☀️</div>
          E-LAW Solar
        </a>
        <div className="nav-center">
          <a href="#packages">Packages</a>
          <a href="#solutions">Services</a>
          <a href="#why">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span style={{fontSize:'0.8rem', color:'rgba(255,255,255,0.5)'}}>{user.email}</span>
              <a href="/dashboard" className="nav-cta">Dashboard</a>
            </>
          ) : (
            <>
              <a href="/auth" className="nav-login">Login</a>
              <a href="#contact" className="nav-cta">Get Quote</a>
            </>
          )}
        </div>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(true)}>☰</button>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">Residential Solar — Metro Manila & NCR</div>
          <h1 className="hero-title">Renewable Energy Solutions for Filipino Homes</h1>
          <p className="hero-sub">Stop overpaying MERALCO. E-LAW Solar brings premium solar technology to Filipino families — cut your bill by up to 90%.</p>
          <div className="hero-btns">
            <a href="#packages" className="btn-primary">Our Solar Solutions</a>
            <a href="#contact" className="btn-ghost">Speak To A Pro</a>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-sec">
        <div className="stats-inner">
          {[
            { num: '90%', lbl: 'Energy Bill Reduction' },
            { num: '10K+', lbl: 'Filipino Homes by 2030' },
            { num: '25 yrs', lbl: 'Panel Warranty' },
            { num: '3–5 yrs', lbl: 'Payback Period' },
          ].map((s, i) => (
            <div key={i}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOLUTIONS */}
      <div className="solutions" id="solutions">
        <div className="solutions-inner">
          <div className="sec-eyebrow">What We Offer</div>
          <h2 className="sec-title">Solar Solutions That Works</h2>
          <div className="solutions-grid">
            {[
              { title: 'Solar Panel Install', desc: 'Tailor-made solar solutions designed to fit the unique specifications of your home or business.' },
              { title: 'Storage Solutions', desc: 'Ensure uninterrupted power with our cutting-edge solar battery storage solutions.' },
              { title: 'Efficiency Audit', desc: 'Maximize your investment with our comprehensive solar efficiency audits, government approved!' },
              { title: 'Financing & Incentives', desc: 'Navigate the financial aspects of going solar with ease. Includes incentives, rebates, grants and more.' },
            ].map((s, i) => (
              <div className="solution-item" key={i}>
                <div className="solution-title">{s.title}</div>
                <div className="solution-desc">{s.desc}</div>
                <a href="#contact" className="solution-link">Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY US */}
      <div className="why-sec" id="why">
        <div className="why-inner">
          <div className="why-content">
            <h2 className="why-title">Why Partner with Us for Your Solar Energy Solutions?</h2>
            <div className="why-subtitle">Experience, Innovation, and Commitment in Every Project</div>
            <p className="why-text">
              At the core of our mission lies a profound commitment to transforming the way our world is powered, one solar solution at a time. With years of experience under our belt, our team brings a wealth of knowledge and a fresh perspective to each project, ensuring that every installation is tailored to meet our clients' specific needs.
              <br/><br/>
              Our innovative approach combines the latest solar technologies with eco-friendly practices, making us leaders in sustainable energy solutions. But it's our unwavering commitment to excellence and customer satisfaction that truly sets us apart.
            </p>
            <a href="#contact" className="why-link">Start Your Project →</a>
          </div>
          <div className="why-img">
            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80" alt="Solar installation" onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
          </div>
        </div>
      </div>

      {/* PACKAGES */}
      <div className="packages-sec" id="packages">
        <div className="packages-inner">
          <div className="sec-eyebrow">Solar Packages</div>
          <h2 className="sec-title">Find the Right System for Your Home</h2>
          <div className="packages-grid">
            {packages.map((pkg, i) => (
              <div className={`pkg-card${pkg.popular ? ' popular' : ''}`} key={i}>
                <div className="pkg-img-placeholder">
                  <span>☀️</span>
                  <span>Product Photo</span>
                </div>
                {pkg.popular && <div className="popular-badge">Most Popular</div>}
                <div className="pkg-body">
                  <div className="pkg-tagline">{pkg.tagline}</div>
                  <div className="pkg-name">{pkg.name}</div>
                  <hr className="pkg-divider" />
                  <div className="pkg-row">
                    <span className="pkg-row-lbl">Monthly Bill</span>
                    <span className="pkg-row-val">{pkg.bill}</span>
                  </div>
                  <div className="pkg-row">
                    <span className="pkg-row-lbl">Monthly Savings</span>
                    <span className="pkg-row-val" style={{color:'#1AA3DE'}}>{pkg.savings}</span>
                  </div>
                  <div className="pkg-row">
                    <span className="pkg-row-lbl">Payback Period</span>
                    <span className="pkg-row-val">{pkg.payback}</span>
                  </div>
                  <div className="pkg-row">
                    <span className="pkg-row-lbl">25-yr Savings</span>
                    <span className="pkg-row-val" style={{color:'#1AA3DE'}}>{pkg.total}</span>
                  </div>
                  <div className="pkg-price">{pkg.price}</div>
                  <a href="/packages" className={`pkg-btn${pkg.popular ? ' primary' : ''}`}>Buy Now →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CALCULATOR */}
      <div className="calc-sec" id="calculator">
        <div className="calc-inner">
          <div>
            <div className="sec-eyebrow">Savings Calculator</div>
            <h2 className="sec-title">How Much Can You Save?</h2>
            <p style={{fontSize:'0.88rem', color:'rgba(255,255,255,0.5)', lineHeight:'1.75', maxWidth:'400px'}}>
              Enter your average monthly MERALCO bill and we'll instantly recommend the best solar package for your home.
            </p>
          </div>
          <div className="calc-card">
            <label className="calc-lbl">Your average monthly electricity bill (₱)</label>
            <input className="calc-input" type="number" placeholder="e.g. 8,500" value={bill} onChange={(e) => { setBill(e.target.value); setRecommended(null) }} />
            <button className="btn-primary" style={{width:'100%'}} onClick={calculatePackage}>Find My Package →</button>
            {recommended && (
              <div className="calc-result">
                <div className="calc-result-label">✅ Recommended for you</div>
                <div className="calc-result-name">{recommended.name}</div>
                <div className="calc-result-desc">{recommended.size} system · Save {recommended.savings}/month · Invest {recommended.price}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-sec" id="contact">
        <div className="cta-inner">
          <div className="sec-eyebrow" style={{justifyContent:'center', display:'flex'}}>Get Started Today</div>
          <h2 className="cta-title">Ready to Stop Overpaying for Electricity?</h2>
          <p className="cta-desc">Book a free home consultation. No obligation, no pressure. Our team will assess your home and recommend the best solar setup.</p>
          <div className="cta-btns">
            <a href="https://m.me/elawsolar" className="btn-primary">💬 Message Us on Facebook</a>
            <a href="tel:09560641174" className="btn-ghost">📞 Call 0956 064 1174</a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <a href="#" className="nav-logo" style={{textDecoration:'none'}}>
              <div className="nav-logo-icon">☀️</div>
              E-LAW Solar
            </a>
            <p className="footer-desc">Bringing affordable solar energy to Filipino urban families. Cut your bill, save the planet, invest in your future.</p>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <a href="#why">About Us</a>
              <a href="#solutions">Services</a>
              <a href="#packages">Packages</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <div className="footer-links">
              <a href="#solutions">Solar Installation</a>
              <a href="#solutions">Battery Storage</a>
              <a href="#solutions">Energy Audit</a>
              <a href="#solutions">Financing</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-links">
              <a href="tel:09560641174">📞 0956 064 1174</a>
              <a href="mailto:e-lawsolar@gmail.com">✉️ e-lawsolar@gmail.com</a>
              <a href="#">📍 Batasan Hills, Quezon City</a>
              <a href="https://m.me/elawsolar">💬 Facebook Messenger</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 E-LAW Solar. All rights reserved.</div>
          <div className="footer-tagline">"Sa E-LAW, ang araw ay para sa lahat." ☀️</div>
        </div>
      </footer>
    </>
  )
}
