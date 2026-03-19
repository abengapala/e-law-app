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
      name: 'Bahay Saver', tagline: 'Starter Package', size: '3 kW', panels: 6,
      bill: '₱4,000 – ₱7,000', savings: '₱2,000 – ₱3,500', price: '₱150,000–₱175,000',
      payback: '4–5 years', total: '₱600,000+', minBill: 4000, maxBill: 6999,
    },
    {
      name: 'Family Power', tagline: 'Standard Package', size: '5 kW', panels: 10,
      bill: '₱7,000 – ₱10,000', savings: '₱4,000 – ₱7,000', price: '₱250,000–₱280,000',
      payback: '3.5–4 years', total: '₱2,100,000+', minBill: 7000, maxBill: 9999, popular: true,
    },
    {
      name: 'Home Independence', tagline: 'Premium Package', size: '8 kW', panels: 16,
      bill: '₱10,000 – ₱15,000', savings: '₱6,000 – ₱10,000', price: '₱420,000–₱450,000',
      payback: '3.5–4.5 years', total: '₱3,000,000+', minBill: 10000, maxBill: 14999,
    },
    {
      name: 'Zero Bill', tagline: 'Ultimate Package', size: '10–12 kW', panels: 22,
      bill: '₱15,000+', savings: '₱10,000 – ₱15,000+', price: '₱550,000–₱700,000',
      payback: '3–4 years', total: '₱4,500,000+', minBill: 15000, maxBill: Infinity,
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; overflow-x: hidden; }
        body { font-family: 'DM Sans', sans-serif; background: #0E1C29; color: #fff; overflow-x: hidden; }

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
        .nav-logo { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.2rem; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 0.6rem; letter-spacing: 0.02em; }
        .nav-logo-icon { width: 30px; height: 30px; background: #1AA3DE; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .nav-center { display: flex; gap: 2.5rem; align-items: center; }
        .nav-center a { color: rgba(255,255,255,0.65); text-decoration: none; font-size: 0.85rem; font-weight: 400; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
        .nav-center a:hover { color: #fff; }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .nav-cta { background: #1AA3DE; color: #fff; padding: 0.5rem 1.25rem; border-radius: 5px; font-weight: 500; font-size: 0.83rem; text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .nav-cta:hover { background: #1591c7; }
        .nav-login { color: rgba(255,255,255,0.65); text-decoration: none; font-size: 0.85rem; font-weight: 400; transition: color 0.2s; }
        .nav-login:hover { color: #fff; }
        .nav-mobile-btn { display: none; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }

        .mobile-menu { display: none; position: fixed; inset: 0; z-index: 999; background: rgba(14,28,41,0.99); backdrop-filter: blur(20px); flex-direction: column; align-items: center; justify-content: center; gap: 2rem; }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; text-decoration: none; }
        .mobile-menu-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; }

        .hero {
          min-height: 100vh;
          background: linear-gradient(180deg, rgba(14,28,41,0.5) 0%, rgba(14,28,41,0.75) 50%, #0E1C29 100%),
            url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=80') center/cover no-repeat;
          display: flex; align-items: flex-end; padding: 0 3rem 5rem;
        }
        .hero-inner { max-width: 1100px; margin: 0 auto; width: 100%; padding-top: 9rem; }
        .hero-eyebrow { font-size: 0.68rem; color: rgba(255,255,255,0.5); font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1rem; font-family: 'DM Sans', sans-serif; }
        .hero-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          max-width: 900px; color: #fff;
        }
        .hero-tagline { font-size: 0.78rem; color: #1AA3DE; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 1.5rem; font-family: 'DM Sans', sans-serif; }
        .hero-sub { font-size: 0.88rem; color: rgba(255,255,255,0.55); line-height: 1.75; max-width: 480px; margin-bottom: 2rem; font-weight: 400; font-family: 'DM Sans', sans-serif; }
        .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary { background: #1AA3DE; color: #fff; padding: 0.8rem 1.75rem; border-radius: 5px; font-weight: 500; font-size: 0.88rem; border: none; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-primary:hover { background: #1591c7; transform: translateY(-1px); }
        .btn-ghost { background: transparent; color: #fff; padding: 0.8rem 1.75rem; border-radius: 5px; font-weight: 400; font-size: 0.88rem; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.45); }

        .stats-sec { background: #132030; padding: 3rem 3rem; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .stats-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center; }
       .stat-num { font-family: 'DM Sans', sans-serif; font-size: 1.9rem; font-weight: 500; color: #1AA3DE; margin-bottom: 0.25rem; }
        .stat-lbl { font-size: 0.78rem; color: rgba(255,255,255,0.45); font-weight: 400; font-family: 'DM Sans', sans-serif; }

        .solutions { background: #0E1C29; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .solutions-inner { max-width: 1100px; margin: 0 auto; }
        .sec-eyebrow { font-size: 0.68rem; color: rgba(255,255,255,0.35); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.4rem; font-family: 'DM Sans', sans-serif; }
        .sec-title { font-family: 'Syne', sans-serif; font-size: clamp(1.4rem, 2.8vw, 2rem); font-weight: 700; color: #fff; margin-bottom: 2.5rem; letter-spacing: 0.3px; }
        .solutions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5rem; }
        .solution-title { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 0.65rem; letter-spacing: 0.02em; }
        .solution-desc { font-size: 0.8rem; color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 0.85rem; font-weight: 400; }
        .solution-link { font-size: 0.78rem; color: #1AA3DE; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 0.3rem; transition: gap 0.2s; font-family: 'DM Sans', sans-serif; }
        .solution-link:hover { gap: 0.55rem; }

        .why-sec { background: #0a1520; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .why-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .why-title { font-family: 'Syne', sans-serif; font-size: clamp(1.3rem, 2.5vw, 1.75rem); font-weight: 700; color: #fff; margin-bottom: 0.4rem; line-height: 1.25; letter-spacing: 0.2px; }
        .why-subtitle { font-size: 0.75rem; color: rgba(255,255,255,0.35); letter-spacing: 0.08em; margin-bottom: 1.25rem; font-family: 'DM Sans', sans-serif; }
        .why-text { font-size: 0.82rem; color: rgba(255,255,255,0.5); line-height: 1.85; margin-bottom: 1.5rem; font-weight: 400; font-family: 'DM Sans', sans-serif; }
        .why-link { font-size: 0.8rem; color: #1AA3DE; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 0.3rem; transition: gap 0.2s; width: fit-content; font-family: 'DM Sans', sans-serif; }
        .why-link:hover { gap: 0.55rem; }
        .why-img { border-radius: 10px; overflow: hidden; height: 320px; background: #1a2f3f; }
        .why-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .packages-sec { background: #0E1C29; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .packages-inner { max-width: 1100px; margin: 0 auto; }
        .packages-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-top: 2.5rem; }
        .pkg-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; overflow: hidden; transition: all 0.3s; position: relative; }
        .pkg-card:hover { transform: translateY(-4px); border-color: rgba(26,163,222,0.25); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .pkg-card.popular { border-color: rgba(26,163,222,0.35); }
        .pkg-img-placeholder { width: 100%; height: 155px; background: linear-gradient(135deg, #1a2f3f, #0e1c29); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; color: rgba(255,255,255,0.25); font-size: 0.72rem; font-family: 'DM Sans', sans-serif; }
        .pkg-img-placeholder span { font-size: 2rem; }
        .pkg-img { width: 100%; height: 155px; object-fit: cover; display: block; }
        .popular-badge { position: absolute; top: 10px; right: 10px; background: #1AA3DE; color: #fff; font-size: 0.58rem; font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.08em; font-family: 'DM Sans', sans-serif; }
        .pkg-body { padding: 1.1rem 1.25rem; }
        .pkg-tagline { font-size: 0.62rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.2rem; font-family: 'DM Sans', sans-serif; }
        .pkg-name { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.65rem; letter-spacing: 0.02em; }
        .pkg-divider { border: none; border-top: 1px solid rgba(255,255,255,0.05); margin: 0.65rem 0; }
        .pkg-row { display: flex; justify-content: space-between; margin-bottom: 0.35rem; }
        .pkg-row-lbl { font-size: 0.72rem; color: rgba(255,255,255,0.4); font-family: 'DM Sans', sans-serif; }
        .pkg-row-val { font-size: 0.75rem; font-weight: 500; color: rgba(255,255,255,0.85); font-family: 'DM Sans', sans-serif; }
       .pkg-price { font-family: 'DM Sans', sans-serif; font-size: 1.15rem; font-weight: 500; color: #1AA3DE; margin: 0.75rem 0; }
        .pkg-btn { width: 100%; padding: 0.65rem; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(26,163,222,0.25); background: transparent; color: rgba(255,255,255,0.7); }
        .pkg-btn:hover { border-color: #1AA3DE; color: #1AA3DE; }
        .pkg-btn.primary { background: #1AA3DE; color: #fff; border-color: #1AA3DE; }
        .pkg-btn.primary:hover { background: #1591c7; }

        .calc-sec { background: #0a1520; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .calc-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .calc-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 2rem; }
        .calc-lbl { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; display: block; font-family: 'DM Sans', sans-serif; }
        .calc-input { width: 100%; padding: 0.825rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.92rem; outline: none; transition: border-color 0.2s; margin-bottom: 1rem; }
        .calc-input:focus { border-color: #1AA3DE; }
        .calc-input::placeholder { color: rgba(255,255,255,0.2); }
        .calc-result { background: rgba(26,163,222,0.07); border: 1px solid rgba(26,163,222,0.18); border-radius: 8px; padding: 1.1rem; margin-top: 1rem; }
        .calc-result-label { font-size: 0.67rem; color: #1AA3DE; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.3rem; font-family: 'DM Sans', sans-serif; }
        .calc-result-name { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem; }
        .calc-result-desc { font-size: 0.78rem; color: rgba(255,255,255,0.45); font-family: 'DM Sans', sans-serif; }

        .cta-sec { background: #0E1C29; padding: 5rem 3rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; }
        .cta-inner { max-width: 580px; margin: 0 auto; }
        .cta-title { font-family: 'Syne', sans-serif; font-size: clamp(1.4rem, 2.8vw, 2rem); font-weight: 700; color: #fff; margin-bottom: 0.85rem; letter-spacing: 0.2px; }
        .cta-desc { font-size: 0.85rem; color: rgba(255,255,255,0.45); line-height: 1.75; margin-bottom: 1.75rem; font-family: 'DM Sans', sans-serif; }
        .cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        footer { background: #070e16; border-top: 1px solid rgba(255,255,255,0.05); padding: 4rem 3rem 2rem; }
        .footer-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; padding-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .footer-brand-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; color: #fff; margin-bottom: 0.3rem; }
        .footer-brand-tagline { font-size: 0.7rem; color: #1AA3DE; letter-spacing: 0.05em; margin-bottom: 0.85rem; font-family: 'DM Sans', sans-serif; }
        .footer-desc { font-size: 0.78rem; color: rgba(255,255,255,0.38); line-height: 1.75; max-width: 230px; font-family: 'DM Sans', sans-serif; }
        .footer-col-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.78rem; color: rgba(255,255,255,0.7); margin-bottom: 1.1rem; letter-spacing: 0.05em; }
        .footer-links { display: flex; flex-direction: column; gap: 0.55rem; }
        .footer-links a { font-size: 0.78rem; color: rgba(255,255,255,0.38); text-decoration: none; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
        .footer-links a:hover { color: #1AA3DE; }
        .footer-bottom { max-width: 1100px; margin: 1.75rem auto 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-copy { font-size: 0.73rem; color: rgba(255,255,255,0.25); font-family: 'DM Sans', sans-serif; }
        .footer-tagline { font-size: 0.73rem; color: rgba(255,255,255,0.25); font-style: italic; font-family: 'DM Sans', sans-serif; }

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
          .hero-title { font-size: 1.6rem; letter-spacing: 2px; }
          .solutions, .why-sec, .calc-sec, .packages-sec, .cta-sec { padding: 4rem 1.25rem; }
          .solutions-grid { grid-template-columns: 1fr; gap: 2rem; }
          .why-inner, .calc-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .why-img { height: 200px; }
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

      <nav className={scrolled ? 'scrolled' : ''}>
      <a href="#" className="nav-logo">
      <img src="/logo.png" alt="E-LAW Solar" style={{height:'80px', width:'auto', objectFit:'contain'}} />
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
              <span style={{fontSize:'0.78rem', color:'rgba(255,255,255,0.4)'}}>{user.email}</span>
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

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">Residential Solar — Metro Manila & NCR</div>
          <h1 className="hero-title">Renewable Energy Solutions for Filipino Homes</h1>
          <div className="hero-tagline">Empowering Low-cost Affordable Watts</div>
          <p className="hero-sub">Stop overpaying MERALCO. E-LAW Solar helps Filipino families cut their electricity bills by 50–90% with affordable residential solar installation and flexible payment options.</p>
          <div className="hero-btns">
            <a href="#packages" className="btn-primary">Our Solar Solutions</a>
            <a href="#contact" className="btn-ghost">Speak To A Pro</a>
          </div>
        </div>
      </div>

      <div className="stats-sec">
        <div className="stats-inner">
          {[
            { num: '50–90%', lbl: 'Electricity Bill Reduction' },
            { num: '10,000', lbl: 'Filipino Homes by 2030' },
            { num: '25 yrs', lbl: 'Panel Performance Warranty' },
            { num: '3–5 yrs', lbl: 'Average Payback Period' },
          ].map((s, i) => (
            <div key={i}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="solutions" id="solutions">
        <div className="solutions-inner">
          <div className="sec-eyebrow">What We Offer</div>
          <h2 className="sec-title">Solar Solutions That Work</h2>
          <div className="solutions-grid">
            {[
              { title: 'Solar Panel Installation', desc: 'Complete end-to-end residential solar installation using Tier 1 monocrystalline panels with 25-year performance warranty.' },
              { title: 'Battery Storage', desc: 'Ensure uninterrupted power with our cutting-edge solar battery storage solutions for 24/7 energy independence.' },
              { title: 'Energy Audit', desc: 'Free comprehensive home energy audit to calculate your exact savings and recommend the right system size.' },
              { title: 'Financing & Incentives', desc: '0% installment, bank financing, rent-to-own options, and guidance on government solar incentives and net metering.' },
            ].map((s, i) => (
              <div key={i}>
                <div className="solution-title">{s.title}</div>
                <div className="solution-desc">{s.desc}</div>
                <a href="#contact" className="solution-link">Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="why-sec" id="why">
        <div className="why-inner">
          <div>
            <h2 className="why-title">Why Partner with Us for Your Solar Energy Solutions?</h2>
            <div className="why-subtitle">Experience, Innovation, and Commitment in Every Project</div>
            <p className="why-text">
              At the core of our mission lies a profound commitment to transforming the way Filipino homes are powered. With deep understanding of local energy challenges, our team brings expertise and a Filipino-first approach to every installation.
              <br/><br/>
              We combine Tier 1 solar technology with transparent pricing and flexible payment options — making clean energy accessible for every Filipino family, not just the privileged few.
            </p>
            <a href="#contact" className="why-link">Start Your Project →</a>
          </div>
          <div className="why-img">
            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80" alt="Solar installation" onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
          </div>
        </div>
      </div>

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
                    <span className="pkg-row-lbl">System Size</span>
                    <span className="pkg-row-val">{pkg.size}</span>
                  </div>
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

      <div className="calc-sec" id="calculator">
        <div className="calc-inner">
          <div>
            <div className="sec-eyebrow">Savings Calculator</div>
            <h2 className="sec-title">How Much Can You Save?</h2>
            <p style={{fontSize:'0.82rem', color:'rgba(255,255,255,0.45)', lineHeight:'1.8', maxWidth:'380px', fontFamily:'DM Sans, sans-serif'}}>
              Enter your average monthly MERALCO bill and we'll instantly recommend the best solar package for your home. MERALCO rates average ₱12.85/kWh — solar pays for itself in 3–5 years.
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

      <div className="cta-sec" id="contact">
        <div className="cta-inner">
          <div className="sec-eyebrow" style={{justifyContent:'center', display:'flex'}}>Get Started Today</div>
          <h2 className="cta-title">Ready to Stop Overpaying for Electricity?</h2>
          <p className="cta-desc">Book a free home energy consultation. No obligation, no pressure. Our certified team will assess your home and calculate your exact savings.</p>
          <div className="cta-btns">
            <a href="https://m.me/elawsolar" className="btn-primary">💬 Message Us on Facebook</a>
            <a href="tel:09560641174" className="btn-ghost">📞 Call 0956 064 1174</a>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">E-LAW Solar</div>
            <div className="footer-brand-tagline">Empowering Low-cost Affordable Watts</div>
            <p className="footer-desc">Bringing affordable solar energy to Filipino urban families in Metro Manila and NCR. Cut your bill, achieve energy independence.</p>
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
              <a href="#solutions">Financing Options</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-links">
              <a href="tel:09560641174">📞 0956 064 1174</a>
              <a href="mailto:e-lawsolar@gmail.com">✉️ e-lawsolar@gmail.com</a>
              <a href="#">📍 Batasan Hills, Quezon City 1126</a>
              <a href="https://m.me/elawsolar">💬 Facebook Messenger</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 E-LAW — Empowering Low-cost Affordable Watts. All rights reserved.</div>
          <div className="footer-tagline">"Sa E-LAW, ang araw ay para sa lahat."</div>
        </div>
      </footer>
    </>
  )
}
