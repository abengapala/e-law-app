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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #f59e0b;
          --gold-dim: rgba(245,158,11,0.15);
          --gold-border: rgba(245,158,11,0.25);
          --navy: #0a0f1e;
          --navy2: #0f172a;
          --card: #111827;
          --card2: #161d2e;
          --text: #f1f5f9;
          --muted: #94a3b8;
          --green: #10b981;
          --border: rgba(255,255,255,0.06);
        }
        html { scroll-behavior: smooth; overflow-x: hidden; }
        body { font-family: 'DM Sans', sans-serif; background: var(--navy); color: var(--text); overflow-x: hidden; }

        /* NAV */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 1.25rem 3rem;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.4s ease;
        }
        nav.scrolled {
          background: rgba(10,15,30,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 0.9rem 3rem;
        }
        .nav-logo {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem;
          color: var(--text); text-decoration: none; letter-spacing: -0.5px;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .nav-logo-icon {
          width: 32px; height: 32px; background: var(--gold);
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }
        .nav-logo span { color: var(--gold); }
        .nav-center { display: flex; gap: 2.5rem; align-items: center; }
        .nav-center a {
          color: var(--muted); text-decoration: none; font-size: 0.88rem;
          font-weight: 500; transition: color 0.2s; letter-spacing: 0.01em;
        }
        .nav-center a:hover { color: var(--text); }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .nav-cta {
          background: var(--gold); color: var(--navy) !important;
          padding: 0.55rem 1.35rem; border-radius: 8px;
          font-weight: 700; font-size: 0.85rem; text-decoration: none;
          display: flex; align-items: center; gap: 0.4rem;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          border: none; cursor: pointer;
        }
        .nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }
        .nav-login { color: var(--muted); text-decoration: none; font-size: 0.88rem; font-weight: 500; transition: color 0.2s; }
        .nav-login:hover { color: var(--text); }
        .nav-mobile-btn { display: none; background: none; border: none; color: var(--text); font-size: 1.5rem; cursor: pointer; }

        /* HERO */
        .hero {
          min-height: 100vh;
          background: linear-gradient(180deg, rgba(10,15,30,0.7) 0%, rgba(10,15,30,0.85) 60%, var(--navy) 100%),
            url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=80') center/cover no-repeat;
          display: flex; align-items: center;
          padding: 10rem 3rem 6rem;
          position: relative;
        }
        .hero-inner { max-width: 1200px; margin: 0 auto; width: 100%; }
        .hero-label {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--gold-dim); border: 1px solid var(--gold-border);
          color: var(--gold); padding: 0.35rem 1rem; border-radius: 100px;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 1.75rem;
        }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -1.5px; margin-bottom: 1.5rem;
          max-width: 700px;
        }
        .hero-title .accent { color: var(--gold); }
        .hero-desc {
          font-size: 1.1rem; color: var(--muted); line-height: 1.75;
          max-width: 520px; margin-bottom: 2.5rem; font-weight: 400;
        }
        .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-gold {
          background: var(--gold); color: var(--navy);
          padding: 0.9rem 2rem; border-radius: 8px;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem;
          border: none; cursor: pointer; text-decoration: none; display: inline-block;
          transition: all 0.2s; letter-spacing: 0.01em;
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(245,158,11,0.35); }
        .btn-outline {
          background: transparent; color: var(--text);
          padding: 0.9rem 2rem; border-radius: 8px;
          font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.95rem;
          border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
          text-decoration: none; display: inline-block; transition: all 0.2s;
        }
        .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

        /* STATS BAR */
        .stats-bar {
          background: var(--card); border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 2rem 3rem;
        }
        .stats-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 2rem; text-align: center;
        }
        .stat-item { padding: 0.5rem; }
        .stat-num {
          font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800;
          color: var(--gold); line-height: 1; margin-bottom: 0.35rem;
        }
        .stat-lbl { font-size: 0.82rem; color: var(--muted); font-weight: 500; }

        /* SECTIONS */
        section { padding: 6rem 3rem; }
        .container { max-width: 1200px; margin: 0 auto; }
        .sec-label {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.15em; color: var(--gold); margin-bottom: 0.75rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .sec-label::before { content: ''; width: 20px; height: 2px; background: var(--gold); border-radius: 2px; }
        .sec-title {
          font-family: 'Syne', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800; letter-spacing: -0.5px; margin-bottom: 1rem; line-height: 1.15;
        }
        .sec-desc { font-size: 1rem; color: var(--muted); max-width: 520px; line-height: 1.7; }

        /* SERVICES */
        .services-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem; margin-top: 3.5rem;
        }
        .service-card {
          background: var(--card2); border: 1px solid var(--border);
          border-radius: 16px; padding: 2rem;
          transition: all 0.3s; cursor: default;
        }
        .service-card:hover { border-color: var(--gold-border); transform: translateY(-3px); }
        .service-icon {
          width: 48px; height: 48px; background: var(--gold-dim);
          border: 1px solid var(--gold-border); border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 1.25rem;
        }
        .service-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 0.6rem; }
        .service-desc { font-size: 0.84rem; color: var(--muted); line-height: 1.6; margin-bottom: 1rem; }
        .service-link { font-size: 0.82rem; color: var(--gold); font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 0.3rem; }
        .service-link:hover { gap: 0.6rem; }

        /* PACKAGES */
        .packages-sec { background: var(--navy2); }
        .packages-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem; margin-top: 3.5rem;
        }
        .pkg-card {
          background: var(--card2); border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden;
          transition: all 0.3s; position: relative;
        }
        .pkg-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.12); }
        .pkg-card.popular { border-color: var(--gold-border); }
        .pkg-img {
          width: 100%; height: 180px; object-fit: cover;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem; position: relative; overflow: hidden;
        }
        .pkg-img-placeholder {
          width: 100%; height: 180px;
          background: linear-gradient(135deg, #1a2540 0%, #111827 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0.5rem; color: var(--muted); font-size: 0.8rem;
        }
        .pkg-img-placeholder span { font-size: 2.5rem; }
        .popular-tag {
          position: absolute; top: 12px; right: 12px;
          background: var(--gold); color: var(--navy);
          font-size: 0.65rem; font-weight: 800; padding: 0.25rem 0.65rem;
          border-radius: 100px; text-transform: uppercase; letter-spacing: 0.05em;
          font-family: 'Syne', sans-serif;
        }
        .pkg-body { padding: 1.5rem; }
        .pkg-tagline { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.35rem; }
        .pkg-name { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; margin-bottom: 0.25rem; }
        .pkg-size { font-size: 1.75rem; font-weight: 800; font-family: 'Syne', sans-serif; line-height: 1; margin-bottom: 1rem; }
        .pkg-divider { border: none; border-top: 1px solid var(--border); margin: 1rem 0; }
        .pkg-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .pkg-row-lbl { font-size: 0.78rem; color: var(--muted); }
        .pkg-row-val { font-size: 0.82rem; font-weight: 600; }
        .pkg-price { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--gold); margin: 1rem 0; }
        .pkg-btn {
          width: 100%; padding: 0.8rem; border-radius: 10px;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; border: 1px solid var(--gold-border);
          background: transparent; color: var(--text); transition: all 0.2s;
          text-decoration: none; display: block; text-align: center;
        }
        .pkg-btn:hover { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }
        .pkg-btn.primary { background: var(--gold); color: var(--navy); border-color: var(--gold); }
        .pkg-btn.primary:hover { opacity: 0.88; }

        /* WHY US */
        .why-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: center;
        }
        .why-img {
          border-radius: 20px; overflow: hidden;
          background: linear-gradient(135deg, #1a2540, #111827);
          height: 480px; display: flex; align-items: center; justify-content: center;
          font-size: 5rem; border: 1px solid var(--border);
          position: relative;
        }
        .why-img img { width: 100%; height: 100%; object-fit: cover; }
        .why-points { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2.5rem; }
        .why-point { display: flex; gap: 1rem; align-items: flex-start; }
        .why-icon {
          width: 40px; height: 40px; min-width: 40px;
          background: var(--gold-dim); border: 1px solid var(--gold-border);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
        }
        .why-point-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; margin-bottom: 0.25rem; }
        .why-point-desc { font-size: 0.84rem; color: var(--muted); line-height: 1.6; }

        /* CALCULATOR */
        .calc-sec { background: var(--navy2); }
        .calc-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .calc-card {
          background: var(--card2); border: 1px solid var(--border);
          border-radius: 20px; padding: 2.5rem;
        }
        .calc-lbl { font-size: 0.83rem; color: var(--muted); margin-bottom: 0.5rem; display: block; }
        .calc-input {
          width: 100%; padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: var(--text);
          font-family: 'DM Sans', sans-serif; font-size: 1rem;
          outline: none; transition: border-color 0.2s; margin-bottom: 1.25rem;
        }
        .calc-input:focus { border-color: var(--gold); }
        .calc-result {
          background: var(--gold-dim); border: 1px solid var(--gold-border);
          border-radius: 12px; padding: 1.5rem; margin-top: 1.25rem;
        }
        .calc-result-label { font-size: 0.72rem; color: var(--gold); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; }
        .calc-result-name { font-family: 'Syne', sans-serif; font-size: 1.35rem; font-weight: 800; margin-bottom: 0.25rem; }
        .calc-result-desc { font-size: 0.84rem; color: var(--muted); }

        /* CTA */
        .cta-sec {
          background: linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(16,185,129,0.05) 100%);
          border-top: 1px solid var(--gold-border); border-bottom: 1px solid var(--gold-border);
          text-align: center;
        }
        .cta-sec .sec-desc { margin: 0 auto 2.5rem; max-width: 480px; }
        .cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        /* FOOTER */
        footer { background: #070c18; border-top: 1px solid var(--border); padding: 4rem 3rem 2rem; }
        .footer-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem; padding-bottom: 3rem;
          border-bottom: 1px solid var(--border);
        }
        .footer-brand .nav-logo { margin-bottom: 1rem; display: inline-flex; }
        .footer-desc { font-size: 0.84rem; color: var(--muted); line-height: 1.7; max-width: 260px; }
        .footer-col-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; margin-bottom: 1.25rem; }
        .footer-links { display: flex; flex-direction: column; gap: 0.6rem; }
        .footer-links a { font-size: 0.83rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--gold); }
        .footer-bottom {
          max-width: 1200px; margin: 2rem auto 0;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
        }
        .footer-copy { font-size: 0.8rem; color: var(--muted); }
        .footer-tagline { font-size: 0.8rem; color: var(--muted); font-style: italic; }

        /* MOBILE NAV DRAWER */
        .mobile-menu {
          display: none; position: fixed; inset: 0; z-index: 999;
          background: rgba(10,15,30,0.98); backdrop-filter: blur(20px);
          flex-direction: column; align-items: center; justify-content: center; gap: 2rem;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--text); text-decoration: none; }
        .mobile-menu-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: var(--text); font-size: 2rem; cursor: pointer; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .packages-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.25rem; }
          nav.scrolled { padding: 0.85rem 1.25rem; }
          .nav-center { display: none; }
          .nav-right { display: none; }
          .nav-mobile-btn { display: block; }
          .hero { padding: 7rem 1.25rem 4rem; }
          .hero-title { font-size: 2.2rem; letter-spacing: -0.5px; }
          .hero-desc { font-size: 0.95rem; }
          .stats-bar { padding: 1.5rem 1.25rem; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .stat-num { font-size: 1.6rem; }
          section { padding: 4rem 1.25rem; }
          .services-grid { grid-template-columns: 1fr; }
          .packages-grid { grid-template-columns: 1fr; }
          .why-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .why-img { height: 250px; }
          .calc-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; text-align: center; }
          .hero-btns { flex-direction: column; }
          .btn-gold, .btn-outline { text-align: center; }
          .cta-btns { flex-direction: column; align-items: stretch; padding: 0 1rem; }
          footer { padding: 3rem 1.25rem 1.5rem; }
        }
      `}</style>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        <a href="#packages" onClick={() => setMenuOpen(false)}>Packages</a>
        <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="#why" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        {user ? (
          <a href="/dashboard" className="btn-gold" onClick={() => setMenuOpen(false)}>Dashboard</a>
        ) : (
          <>
            <a href="/auth" onClick={() => setMenuOpen(false)}>Login</a>
            <a href="#contact" className="btn-gold" onClick={() => setMenuOpen(false)}>Get Free Quote</a>
          </>
        )}
      </div>

      {/* NAV */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">☀️</div>
          E-<span>LAW</span> Solar
        </a>
        <div className="nav-center">
          <a href="#packages">Packages</a>
          <a href="#services">Services</a>
          <a href="#why">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span style={{fontSize:'0.82rem', color:'var(--muted)'}}>{user.email}</span>
              <a href="/dashboard" className="nav-cta">Dashboard →</a>
            </>
          ) : (
            <>
              <a href="/auth" className="nav-login">Login</a>
              <a href="#contact" className="nav-cta">Get Quote →</a>
            </>
          )}
        </div>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(true)}>☰</button>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-label">🌞 Residential Solar — Metro Manila & NCR</div>
          <h1 className="hero-title">
            Renewable Energy<br />Solutions for <span className="accent">Filipino Homes</span>
          </h1>
          <p className="hero-desc">
            Stop overpaying MERALCO. E-LAW Solar brings premium solar technology to Filipino families — cut your bill by up to 90% and start saving from day one.
          </p>
          <div className="hero-btns">
            <a href="#packages" className="btn-gold">Explore Packages →</a>
            <a href="#contact" className="btn-outline">Get a Free Quote</a>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stats-inner">
          {[
            { num: '90%', lbl: 'Energy Bill Reduction' },
            { num: '10K+', lbl: 'Filipino Homes Target by 2030' },
            { num: '25 yrs', lbl: 'Panel Performance Warranty' },
            { num: '3–5 yrs', lbl: 'Average Payback Period' },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services">
        <div className="container">
          <div className="sec-label">What We Offer</div>
          <h2 className="sec-title">Solar Solutions That Work</h2>
          <p className="sec-desc">Tailor-made solar services designed for every Filipino home and budget.</p>
          <div className="services-grid">
            {[
              { icon: '🔆', title: 'Solar Panel Install', desc: 'Complete end-to-end solar panel installation using Tier 1 panels with 25-year performance guarantee.' },
              { icon: '🔋', title: 'Battery Storage', desc: 'Store excess solar energy with our cutting-edge battery solutions for 24/7 power independence.' },
              { icon: '📊', title: 'Energy Audit', desc: 'Free comprehensive home energy audit to determine the perfect solar setup for your household.' },
              { icon: '💰', title: 'Financing & Incentives', desc: '0% installment plans, bank financing, and guidance on government solar incentives and rebates.' },
            ].map((s, i) => (
              <div className="service-card" key={i}>
                <div className="service-icon">{s.icon}</div>
                <div className="service-title">{s.title}</div>
                <div className="service-desc">{s.desc}</div>
                <a href="#contact" className="service-link">Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="packages-sec">
        <div className="container">
          <div className="sec-label">Solar Packages</div>
          <h2 className="sec-title">Find the Right System for Your Home</h2>
          <p className="sec-desc">Four complete packages designed for every Filipino household and budget.</p>
          <div className="packages-grid">
            {packages.map((pkg, i) => (
              <div className={`pkg-card${pkg.popular ? ' popular' : ''}`} key={i}>
                <div className="pkg-img-placeholder">
                  <span>☀️</span>
                  <span>Product Photo</span>
                </div>
                {pkg.popular && <div className="popular-tag">Most Popular</div>}
                <div className="pkg-body">
                  <div className="pkg-tagline">{pkg.tagline}</div>
                  <div className="pkg-name">{pkg.name}</div>
                  <div className="pkg-size" style={{ color: pkg.color }}>{pkg.size}</div>
                  <div style={{fontSize:'0.78rem', color:'var(--muted)', marginBottom:'1rem'}}>{pkg.panels} solar panels</div>
                  <hr className="pkg-divider" />
                  <div className="pkg-row">
                    <span className="pkg-row-lbl">Monthly Bill</span>
                    <span className="pkg-row-val">{pkg.bill}</span>
                  </div>
                  <div className="pkg-row">
                    <span className="pkg-row-lbl">Monthly Savings</span>
                    <span className="pkg-row-val" style={{color:'var(--green)'}}>{pkg.savings}</span>
                  </div>
                  <div className="pkg-row">
                    <span className="pkg-row-lbl">Payback Period</span>
                    <span className="pkg-row-val">{pkg.payback}</span>
                  </div>
                  <div className="pkg-row">
                    <span className="pkg-row-lbl">25-yr Savings</span>
                    <span className="pkg-row-val" style={{color: pkg.color}}>{pkg.total}</span>
                  </div>
                  <div className="pkg-price">{pkg.price}</div>
                  <a href="/packages" className={`pkg-btn${pkg.popular ? ' primary' : ''}`}>Buy Now →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why">
        <div className="container">
          <div className="why-inner">
            <div>
              <div className="sec-label">Why E-LAW Solar</div>
              <h2 className="sec-title">Built for Filipino Families</h2>
              <p className="sec-desc">We understand the unique energy challenges of Filipino urban homeowners — and we built E-LAW to solve them.</p>
              <div className="why-points">
                {[
                  { icon: '🇵🇭', title: 'Filipino-First Support', desc: 'Tagalog & English support. Local team, local expertise.' },
                  { icon: '💸', title: 'Flexible Payment Options', desc: '0% installment, bank financing, and rent-to-own plans.' },
                  { icon: '⭐', title: 'Tier 1 Solar Panels', desc: '25-year performance warranty with certified installers.' },
                  { icon: '🔧', title: 'Lifetime After-Sales Support', desc: 'From consultation to installation to maintenance.' },
                ].map((w, i) => (
                  <div className="why-point" key={i}>
                    <div className="why-icon">{w.icon}</div>
                    <div>
                      <div className="why-point-title">{w.title}</div>
                      <div className="why-point-desc">{w.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="why-img">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"
                alt="Solar panels on home"
                style={{width:'100%', height:'100%', objectFit:'cover'}}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="calc-sec">
        <div className="container">
          <div className="calc-inner">
            <div>
              <div className="sec-label">Savings Calculator</div>
              <h2 className="sec-title">How Much Can You Save?</h2>
              <p className="sec-desc">Enter your average monthly MERALCO bill and we'll instantly recommend the best solar package for your home.</p>
            </div>
            <div className="calc-card">
              <label className="calc-lbl">Your average monthly electricity bill (₱)</label>
              <input
                className="calc-input" type="number" placeholder="e.g. 8,500"
                value={bill} onChange={(e) => { setBill(e.target.value); setRecommended(null) }}
              />
              <button className="btn-gold" style={{width:'100%'}} onClick={calculatePackage}>
                Find My Package →
              </button>
              {recommended && (
                <div className="calc-result">
                  <div className="calc-result-label">✅ Recommended for you</div>
                  <div className="calc-result-name" style={{color: recommended.color}}>{recommended.name}</div>
                  <div className="calc-result-desc">
                    {recommended.size} system · Save {recommended.savings}/month · Invest {recommended.price}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="cta-sec">
        <div className="container">
          <div className="sec-label" style={{justifyContent:'center'}}>Get Started Today</div>
          <h2 className="sec-title" style={{textAlign:'center'}}>Start Saving with Solar Today</h2>
          <p className="sec-desc" style={{textAlign:'center', margin:'0 auto 2.5rem'}}>Book a free home consultation. No obligation, no pressure.</p>
          <div className="cta-btns">
            <a href="https://m.me/elawsolar" className="btn-gold">💬 Message Us on Facebook</a>
            <a href="tel:09560641174" className="btn-outline">📞 Call 0956 064 1174</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="nav-logo">
              <div className="nav-logo-icon">☀️</div>
              E-<span>LAW</span> Solar
            </a>
            <p className="footer-desc">
              Bringing affordable solar energy to Filipino urban families. Cut your bill, save the planet, and invest in your future.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <a href="#why">About Us</a>
              <a href="#services">Services</a>
              <a href="#packages">Packages</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <div className="footer-links">
              <a href="#services">Solar Installation</a>
              <a href="#services">Battery Storage</a>
              <a href="#services">Energy Audit</a>
              <a href="#services">Financing</a>
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
