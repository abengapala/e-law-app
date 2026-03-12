'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const router = useRouter()

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      if (session.user.email !== adminEmail) { router.push('/'); return }
      setUser(session.user)
      await fetchOrders()
      setLoading(false)
    }
    init()
  }, [])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, packages(name, price), profiles(full_name, phone), user_id')
      .order('created_at', { ascending: false })
    setOrders(data || [])
  }

  const updateStatus = async (orderId: number, status: string) => {
    setUpdating(orderId)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    await fetchOrders()
    setUpdating(null)
  }

  const getStatusColor = (status: string) => {
    if (status === 'pending') return '#f59e0b'
    if (status === 'confirmed') return '#6ee7b7'
    if (status === 'installed') return '#a5b4fc'
    return '#94a3b8'
  }

  if (loading) return (
    <div style={{minHeight:'100vh', background:'#0a0f1e', display:'flex', alignItems:'center', justifyContent:'center', color:'#f59e0b', fontFamily:'sans-serif', fontSize:'1.2rem'}}>
      Loading admin panel...
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0f1e; color: #e2e8f0; }
        .nav { background: #161d2e; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: #f59e0b; }
        .admin-badge { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .nav-btn { padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid rgba(245,158,11,0.3); background: transparent; color: #f59e0b; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .nav-btn:hover { background: rgba(245,158,11,0.1); }
        .container { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
        .page-title span { color: #f59e0b; }
        .sub { color: #94a3b8; font-size: 0.9rem; margin-bottom: 2rem; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .stat-card { background: #161d2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.25rem; }
        .stat-label { font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #f59e0b; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
        .order-card { background: #161d2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem; }
        .order-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
        .order-id { font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem; }
        .order-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; }
        .order-price { color: #f59e0b; font-size: 0.9rem; font-weight: 600; margin-top: 0.2rem; }
        .customer-info { font-size: 0.85rem; color: #94a3b8; margin-top: 0.25rem; }
        .order-date { font-size: 0.8rem; color: #64748b; text-align: right; }
        .status-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .status { padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.8rem; font-weight: 600; }
        .status-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .status-btn { padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; cursor: pointer; border: 1px solid; font-family: 'Syne', sans-serif; transition: all 0.2s; background: transparent; }
        .status-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .status-btn.pending { border-color: rgba(245,158,11,0.4); color: #f59e0b; }
        .status-btn.pending:hover { background: rgba(245,158,11,0.1); }
        .status-btn.confirmed { border-color: rgba(16,185,129,0.4); color: #6ee7b7; }
        .status-btn.confirmed:hover { background: rgba(16,185,129,0.1); }
        .status-btn.installed { border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
        .status-btn.installed:hover { background: rgba(99,102,241,0.1); }
        .empty { text-align: center; padding: 3rem; color: #94a3b8; }
        @media (max-width: 768px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
          .nav { flex-wrap: wrap; gap: 0.5rem; }
          .order-top { flex-direction: column; }
        }
      `}</style>

      <nav className="nav">
        <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
          <div className="logo">☀️ E-LAW Solar</div>
          <span className="admin-badge">ADMIN</span>
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={() => router.push('/')}>🏠 Home</button>
          <button className="nav-btn" onClick={async () => { await supabase.auth.signOut(); router.push('/') }}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-title">Admin <span>Dashboard</span></div>
        <p className="sub">Manage all customer orders and update installation status.</p>

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
            <div className="stat-value" style={{color:'#6ee7b7'}}>{orders.filter(o => o.status === 'confirmed').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Installed</div>
            <div className="stat-value" style={{color:'#a5b4fc'}}>{orders.filter(o => o.status === 'installed').length}</div>
          </div>
        </div>

        <div className="section-title">All Orders</div>

        {orders.length === 0 ? (
          <div className="empty">No orders yet! 🌞</div>
        ) : (
          orders.map(order => (
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
  <span style={{fontSize:'0.8rem', color:'#64748b'}}>ID: {order.user_id?.slice(0,8)}...</span>
</div>
                </div>
                <div className="order-date">
                  {new Date(order.created_at).toLocaleDateString('en-PH', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </div>
              </div>
              <div className="status-row">
                <span className="status" style={{
                  background: `${getStatusColor(order.status)}20`,
                  color: getStatusColor(order.status),
                  border: `1px solid ${getStatusColor(order.status)}40`
                }}>
                  {order.status}
                </span>
                <div className="status-btns">
  {order.status === 'cancelled' ? (
    <span style={{fontSize:'0.85rem', color:'#fca5a5', background:'rgba(239,68,68,0.1)', padding:'0.35rem 0.85rem', borderRadius:'99px', border:'1px solid rgba(239,68,68,0.3)'}}>
      ❌ Cancelled by customer
    </span>
  ) : (
    <>
      <button className="status-btn pending" disabled={order.status === 'pending' || updating === order.id}
        onClick={() => updateStatus(order.id, 'pending')}>
        Pending
      </button>
      <button className="status-btn confirmed" disabled={order.status === 'confirmed' || updating === order.id}
        onClick={() => updateStatus(order.id, 'confirmed')}>
        ✓ Confirm
      </button>
      <button className="status-btn installed" disabled={order.status === 'installed' || updating === order.id}
        onClick={() => updateStatus(order.id, 'installed')}>
        ⚡ Installed
      </button>
    </>
  )}
</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}