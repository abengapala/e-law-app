'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const PACKAGE_IDS = [
  { id: 1, name: 'Bahay Saver' },
  { id: 2, name: 'Family Power' },
  { id: 3, name: 'Home Independence' },
  { id: 4, name: 'Zero Bill' },
]

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const [uploadingPkg, setUploadingPkg] = useState<number | null>(null)
  const [pkgImages, setPkgImages] = useState<Record<number, string>>({})
  const [activeTab, setActiveTab] = useState<'orders' | 'packages'>('orders')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      if (session.user.email !== 'ederalbertoabrazado28@gmail.com') { router.push('/'); return }
      setUser(session.user)
      await fetchOrders()
      await fetchImages()
      setLoading(false)
    }
    init()
  }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*, packages(name, price), profiles(full_name, phone), user_id').order('created_at', { ascending: false })
    setOrders(data || [])
  }

  const fetchImages = async () => {
    const { data } = await supabase.from('packages').select('id, image_url')
    if (data) {
      const map: Record<number, string> = {}
      data.forEach((pkg: any) => { if (pkg.image_url) map[pkg.id] = pkg.image_url })
      setPkgImages(map)
    }
  }

  const updateStatus = async (orderId: number, status: string) => {
    setUpdating(orderId)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    await fetchOrders()
    setUpdating(null)
  }

  const handleImageUpload = async (pkgId: number, file: File) => {
    setUploadingPkg(pkgId)
    try {
      const ext = file.name.split('.').pop()
      const path = `package-${pkgId}.${ext}`
      const { error: uploadError } = await supabase.storage.from('package-images').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('package-images').getPublicUrl(path)
      const publicUrl = urlData.publicUrl + '?t=' + Date.now()
      await supabase.from('packages').update({ image_url: publicUrl }).eq('id', pkgId)
      setPkgImages(prev => ({ ...prev, [pkgId]: publicUrl }))
      alert('✅ Image uploaded successfully!')
    } catch (e) {
      alert('Upload failed: ' + e)
    }
    setUploadingPkg(null)
  }

  const statusColor = (status: string) => {
    if (status === 'pending') return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' }
    if (status === 'confirmed') return { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' }
    if (status === 'installed') return { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' }
    if (status === 'cancelled') return { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' }
    return { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: 'rgba(148,163,184,0.25)' }
  }

  if (loading) return (
    <div style={{minHeight:'100vh', background:'#0a0f1e', display:'flex', alignItems:'center', justifyContent:'center', color:'#f59e0b', fontFamily:'Syne, sans-serif', fontSize:'1.1rem', letterSpacing:'0.05em'}}>
      Loading admin panel...
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #f59e0b; --gold-dim: rgba(245,158,11,0.1); --gold-border: rgba(245,158,11,0.2);
          --navy: #0a0f1e; --navy2: #0f172a; --card: #111827; --card2: #161d2e;
          --text: #f1f5f9; --muted: #94a3b8; --green: #10b981; --border: rgba(255,255,255,0.06);
        }
        html, body { overflow-x: hidden; }
        body { font-family: 'DM Sans', sans-serif; font-weight: 400; background: var(--navy); color: var(--text); }
        nav {
          background: rgba(10,15,30,0.96); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 1.1rem 3rem; display: flex; justify-content: space-between; align-items: center;
          position: sticky; top: 0; z-index: 100;
        }
        .nav-left { display: flex; align-items: center; gap: 0.75rem; }
        .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 0.6rem; letter-spacing: 0.03em; }
        .nav-logo-icon { width: 30px; height: 30px; background: var(--gold); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .nav-logo span { color: var(--gold); }
        .admin-badge { background: var(--gold-dim); border: 1px solid var(--gold-border); color: var(--gold); padding: 0.2rem 0.7rem; border-radius: 100px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; }
        .nav-btn { padding: 0.5rem 1.1rem; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; border: none; }
        .nav-btn.ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
        .nav-btn.ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }
        .nav-btn.outline { border: 1px solid var(--gold-border); background: transparent; color: var(--gold); }
        .nav-btn.outline:hover { background: var(--gold-dim); }
        .container { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem; }
        .page-header { margin-bottom: 2.5rem; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 0.35rem; }
        .page-title span { color: var(--gold); }
        .page-sub { color: var(--muted); font-size: 0.88rem; font-weight: 400; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .stat-card { background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem 1.5rem; transition: border-color 0.2s; }
        .stat-card:hover { border-color: var(--gold-border); }
        .stat-label { font-size: 0.72rem; color: var(--muted); margin-bottom: 0.5rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; }
        .tabs-row { display: flex; gap: 0.5rem; margin-bottom: 2rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 4px; width: fit-content; }
        .tab-btn { padding: 0.6rem 1.4rem; border-radius: 9px; border: none; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.82rem; letter-spacing: 0.02em; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--muted); }
        .tab-btn.active { background: var(--gold); color: var(--navy); }
        .order-card { background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; margin-bottom: 0.75rem; transition: border-color 0.2s; }
        .order-card:hover { border-color: rgba(255,255,255,0.1); }
        .order-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem; }
        .order-id { font-size: 0.72rem; color: rgba(148,163,184,0.5); margin-bottom: 0.2rem; letter-spacing: 0.05em; }
        .order-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.01em; margin-bottom: 0.2rem; }
        .order-price { color: var(--gold); font-size: 0.88rem; font-weight: 600; margin-bottom: 0.35rem; }
        .customer-info { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }
        .order-date { font-size: 0.78rem; color: rgba(148,163,184,0.5); text-align: right; }
        .status-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .status { padding: 0.28rem 0.85rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600; border: 1px solid; font-family: 'DM Sans', sans-serif; }
        .status-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .status-btn { padding: 0.3rem 0.85rem; border-radius: 100px; font-size: 0.72rem; font-weight: 700; cursor: pointer; border: 1px solid; font-family: 'Syne', sans-serif; transition: all 0.2s; background: transparent; letter-spacing: 0.02em; }
        .status-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .status-btn.pending { border-color: rgba(245,158,11,0.35); color: #f59e0b; }
        .status-btn.pending:hover:not(:disabled) { background: rgba(245,158,11,0.1); }
        .status-btn.confirmed { border-color: rgba(59,130,246,0.35); color: #60a5fa; }
        .status-btn.confirmed:hover:not(:disabled) { background: rgba(59,130,246,0.1); }
        .status-btn.installed { border-color: rgba(16,185,129,0.35); color: #34d399; }
        .status-btn.installed:hover:not(:disabled) { background: rgba(16,185,129,0.1); }
        .cancelled-tag { font-size: 0.78rem; color: #f87171; background: rgba(239,68,68,0.08); padding: 0.28rem 0.85rem; border-radius: 100px; border: 1px solid rgba(239,68,68,0.25); }
        .pkg-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .pkg-card { background: var(--card2); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: border-color 0.2s; }
        .pkg-card:hover { border-color: var(--gold-border); }
        .pkg-img { width: 100%; height: 200px; object-fit: cover; display: block; }
        .pkg-img-placeholder { width: 100%; height: 200px; background: linear-gradient(135deg, #1a2540, #0f172a); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: var(--muted); font-size: 0.78rem; }
        .pkg-img-placeholder span { font-size: 2.5rem; }
        .pkg-body { padding: 1.25rem 1.5rem; }
        .pkg-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem; letter-spacing: -0.2px; margin-bottom: 1rem; }
        .upload-label { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px dashed var(--gold-border); background: var(--gold-dim); color: var(--gold); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em; }
        .upload-label:hover { border-color: var(--gold); background: rgba(245,158,11,0.15); }
        .upload-input { display: none; }
        .empty { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.9rem; }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.25rem; flex-wrap: wrap; gap: 0.5rem; }
          .container { padding: 2rem 1.25rem; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .order-top { flex-direction: column; }
          .order-date { text-align: left; }
          .pkg-grid { grid-template-columns: 1fr; }
          .status-btns { flex-wrap: wrap; }
        }
      `}</style>

      <nav>
        <div className="nav-left">
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon">☀️</div>
            E-<span>LAW</span> Solar
          </a>
          <span className="admin-badge">Admin</span>
        </div>
        <div className="nav-right">
          <button className="nav-btn ghost" onClick={() => router.push('/')}>Home</button>
          <button className="nav-btn outline" onClick={async () => { await supabase.auth.signOut(); router.push('/') }}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <div className="page-title">Admin <span>Dashboard</span></div>
          <div className="page-sub">Manage orders, update status, and upload product photos.</div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{color:'#f59e0b'}}>{orders.filter(o => o.status === 'pending').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Confirmed</div>
            <div className="stat-value" style={{color:'#60a5fa'}}>{orders.filter(o => o.status === 'confirmed').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Installed</div>
            <div className="stat-value" style={{color:'#34d399'}}>{orders.filter(o => o.status === 'installed').length}</div>
          </div>
        </div>

        <div className="tabs-row">
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>📋 Orders</button>
          <button className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>🖼️ Product Photos</button>
        </div>

        {activeTab === 'orders' && (
          <>
            {orders.length === 0 ? (
              <div className="empty">No orders yet! 🌞</div>
            ) : (
              orders.map(order => {
                const sc = statusColor(order.status)
                return (
                  <div key={order.id} className="order-card">
                    <div className="order-top">
                      <div>
                        <div className="order-id">ORDER #{order.id}</div>
                        <div className="order-name">{order.packages?.name}</div>
                        <div className="order-price">₱{order.packages?.price?.toLocaleString()}</div>
                        <div className="customer-info">
                          👤 {order.profiles?.full_name || 'Unknown'}
                          {order.profiles?.phone && ` · 📞 ${order.profiles.phone}`}
                          <br/>
                          <span style={{fontSize:'0.75rem', color:'rgba(148,163,184,0.5)'}}>ID: {order.user_id?.slice(0,8)}...</span>
                        </div>
                      </div>
                      <div className="order-date">
                        {new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="status-row">
                      <span className="status" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{order.status}</span>
                      <div className="status-btns">
                        {order.status === 'cancelled' ? (
                          <span className="cancelled-tag">❌ Cancelled by customer</span>
                        ) : (
                          <>
                            <button className="status-btn pending" disabled={order.status === 'pending' || updating === order.id} onClick={() => updateStatus(order.id, 'pending')}>Pending</button>
                            <button className="status-btn confirmed" disabled={order.status === 'confirmed' || updating === order.id} onClick={() => updateStatus(order.id, 'confirmed')}>✓ Confirm</button>
                            <button className="status-btn installed" disabled={order.status === 'installed' || updating === order.id} onClick={() => updateStatus(order.id, 'installed')}>⚡ Installed</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </>
        )}

        {activeTab === 'packages' && (
          <div className="pkg-grid">
            {PACKAGE_IDS.map(pkg => (
              <div key={pkg.id} className="pkg-card">
                {pkgImages[pkg.id] ? (
                  <img src={pkgImages[pkg.id]} alt={pkg.name} className="pkg-img" />
                ) : (
                  <div className="pkg-img-placeholder">
                    <span>☀️</span>
                    <span>No photo yet</span>
                  </div>
                )}
                <div className="pkg-body">
                  <div className="pkg-name">{pkg.name}</div>
                  <label className="upload-label">
                    {uploadingPkg === pkg.id ? '⏳ Uploading...' : '📷 Upload Product Photo'}
                    <input
                      type="file" accept="image/*" className="upload-input"
                      disabled={uploadingPkg === pkg.id}
                      onChange={e => { const file = e.target.files?.[0]; if (file) handleImageUpload(pkg.id, file) }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
