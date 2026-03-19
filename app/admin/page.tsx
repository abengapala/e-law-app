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
      data.forEach((p: any) => { if (p.image_url) map[p.id] = p.image_url })
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
    } catch (e) { alert('Upload failed: ' + e) }
    setUploadingPkg(null)
  }

  const statusStyle = (s: string) => {
    if (s === 'pending') return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' }
    if (s === 'confirmed') return { bg: 'rgba(26,163,222,0.1)', color: '#1AA3DE', border: 'rgba(26,163,222,0.2)' }
    if (s === 'installed') return { bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.2)' }
    if (s === 'cancelled') return { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' }
    return { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' }
  }

  if (loading) return (
    <div style={{minHeight:'100vh', background:'#0E1C29', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', fontFamily:'DM Sans, sans-serif', fontSize:'0.9rem', letterSpacing:'0.05em'}}>
      Loading...
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; }
        body { font-family: 'DM Sans', sans-serif; background: #0E1C29; color: #fff; }
        nav { background: rgba(14,28,41,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 1.1rem 3rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .nav-left { display: flex; align-items: center; gap: 0.75rem; }
        .nav-logo { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 0.6rem; letter-spacing: 0.02em; }
        .nav-logo-icon { width: 28px; height: 28px; background: #1AA3DE; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
        .admin-badge { background: rgba(26,163,222,0.1); border: 1px solid rgba(26,163,222,0.2); color: #1AA3DE; padding: 0.18rem 0.6rem; border-radius: 100px; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; }
        .nav-btn { padding: 0.5rem 1.1rem; border-radius: 5px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.83rem; cursor: pointer; transition: all 0.2s; border: none; text-decoration: none; display: inline-block; }
        .nav-btn.ghost { background: transparent; color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.1); }
        .nav-btn.ghost:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
        .nav-btn.outline { border: 1px solid rgba(26,163,222,0.3); background: transparent; color: #1AA3DE; }
        .nav-btn.outline:hover { background: rgba(26,163,222,0.08); }
        .container { max-width: 1080px; margin: 0 auto; padding: 3rem 2rem; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.2px; margin-bottom: 0.3rem; }
        .page-title span { color: #1AA3DE; }
        .page-sub { color: rgba(255,255,255,0.38); font-size: 0.82rem; margin-bottom: 2.5rem; font-family: 'DM Sans', sans-serif; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .stat-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 1.25rem 1.4rem; transition: border-color 0.2s; }
        .stat-card:hover { border-color: rgba(26,163,222,0.2); }
        .stat-label { font-size: 0.65rem; color: rgba(255,255,255,0.35); margin-bottom: 0.45rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
        .stat-value { font-family: 'DM Sans', sans-serif; font-size: 1.6rem; font-weight: 500; }
        .tabs-row { display: flex; gap: 0.4rem; margin-bottom: 2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 3px; width: fit-content; }
        .tab-btn { padding: 0.55rem 1.25rem; border-radius: 6px; border: none; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; background: transparent; color: rgba(255,255,255,0.4); }
        .tab-btn.active { background: #1AA3DE; color: #fff; }
        .order-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 1.35rem 1.5rem; margin-bottom: 0.65rem; transition: border-color 0.2s; }
        .order-card:hover { border-color: rgba(255,255,255,0.1); }
        .order-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.65rem; }
        .order-id { font-size: 0.65rem; color: rgba(255,255,255,0.28); margin-bottom: 0.18rem; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
        .order-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.01em; margin-bottom: 0.18rem; }
        .order-price { color: #1AA3DE; font-size: 0.82rem; font-weight: 500; margin-bottom: 0.3rem; font-family: 'DM Sans', sans-serif; }
        .customer-info { font-size: 0.78rem; color: rgba(255,255,255,0.45); line-height: 1.6; font-family: 'DM Sans', sans-serif; }
        .order-date { font-size: 0.72rem; color: rgba(255,255,255,0.28); font-family: 'DM Sans', sans-serif; }
        .status-row { display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap; }
        .status { padding: 0.22rem 0.75rem; border-radius: 100px; font-size: 0.7rem; font-weight: 500; border: 1px solid; font-family: 'DM Sans', sans-serif; }
        .status-btns { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .status-btn { padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.68rem; font-weight: 500; cursor: pointer; border: 1px solid; font-family: 'DM Sans', sans-serif; transition: all 0.2s; background: transparent; }
        .status-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .status-btn.pending { border-color: rgba(245,158,11,0.3); color: #f59e0b; }
        .status-btn.pending:hover:not(:disabled) { background: rgba(245,158,11,0.08); }
        .status-btn.confirmed { border-color: rgba(26,163,222,0.3); color: #1AA3DE; }
        .status-btn.confirmed:hover:not(:disabled) { background: rgba(26,163,222,0.08); }
        .status-btn.installed { border-color: rgba(16,185,129,0.3); color: #34d399; }
        .status-btn.installed:hover:not(:disabled) { background: rgba(16,185,129,0.08); }
        .cancelled-tag { font-size: 0.72rem; color: rgba(248,113,113,0.7); background: rgba(239,68,68,0.07); padding: 0.22rem 0.75rem; border-radius: 100px; border: 1px solid rgba(239,68,68,0.18); font-family: 'DM Sans', sans-serif; }
        .pkg-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        .pkg-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; overflow: hidden; transition: border-color 0.2s; }
        .pkg-card:hover { border-color: rgba(26,163,222,0.2); }
        .pkg-img { width: 100%; height: 190px; object-fit: cover; display: block; }
        .pkg-img-placeholder { width: 100%; height: 190px; background: linear-gradient(135deg, #1a2f3f, #0e1c29); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; color: rgba(255,255,255,0.25); font-size: 0.72rem; font-family: 'DM Sans', sans-serif; }
        .pkg-img-placeholder span { font-size: 2.5rem; }
        .pkg-body { padding: 1.1rem 1.35rem; }
        .pkg-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; letter-spacing: 0.01em; margin-bottom: 0.85rem; }
        .upload-label { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.7rem; border-radius: 7px; border: 1px dashed rgba(26,163,222,0.25); background: rgba(26,163,222,0.05); color: #1AA3DE; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .upload-label:hover { border-color: rgba(26,163,222,0.45); background: rgba(26,163,222,0.09); }
        .upload-input { display: none; }
        .empty { text-align: center; padding: 3rem; color: rgba(255,255,255,0.35); font-size: 0.85rem; font-family: 'DM Sans', sans-serif; }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.25rem; flex-wrap: wrap; gap: 0.5rem; }
          .container { padding: 2rem 1.25rem; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .order-top { flex-direction: column; }
          .pkg-grid { grid-template-columns: 1fr; }
          .status-btns { flex-wrap: wrap; }
        }
      `}</style>

      <nav>
        <div className="nav-left">
          <a href="/" className="nav-logo">
          <img src="/logo.png" alt="E-LAW Solar" style={{width:'auto', height:'80px', borderRadius:'6px', objectFit:'contain'}} />
          </a>
          <span className="admin-badge">Admin</span>
        </div>
        <div className="nav-right">
          <button className="nav-btn ghost" onClick={() => router.push('/')}>Home</button>
          <button className="nav-btn outline" onClick={async () => { await supabase.auth.signOut(); router.push('/') }}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-title">Admin <span>Dashboard</span></div>
        <div className="page-sub">Manage orders, update status, and upload product photos.</div>

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
            <div className="stat-value" style={{color:'#1AA3DE'}}>{orders.filter(o => o.status === 'confirmed').length}</div>
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
          orders.length === 0 ? (
            <div className="empty">No orders yet 🌞</div>
          ) : (
            orders.map(order => {
              const sc = statusStyle(order.status)
              return (
                <div key={order.id} className="order-card">
                  <div className="order-top">
                    <div>
                      <div className="order-id">Order #{order.id}</div>
                      <div className="order-name">{order.packages?.name}</div>
                      <div className="order-price">₱{order.packages?.price?.toLocaleString()}</div>
                      <div className="customer-info">
                        👤 {order.profiles?.full_name || 'Unknown'}
                        {order.profiles?.phone && ` · 📞 ${order.profiles.phone}`}
                        <br/>
                        <span style={{fontSize:'0.7rem', color:'rgba(255,255,255,0.22)'}}>ID: {order.user_id?.slice(0,8)}...</span>
                      </div>
                    </div>
                    <div className="order-date">{new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
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
          )
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
                    <input type="file" accept="image/*" className="upload-input" disabled={uploadingPkg === pkg.id} onChange={e => { const file = e.target.files?.[0]; if (file) handleImageUpload(pkg.id, file) }} />
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
