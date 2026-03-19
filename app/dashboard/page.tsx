'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      if (session.user.email === 'ederalbertoabrazado28@gmail.com') { router.push('/admin'); return }
      setUser(session.user)
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(profileData)
      const { data: ordersData } = await supabase.from('orders').select('*, packages(name, price, description)').eq('user_id', session.user.id).order('created_at', { ascending: false })
      setOrders(ordersData || [])
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCancel = async (orderId: number) => {
    const confirm = window.confirm('Are you sure you want to cancel this order?\n\nFor refunds, please contact us:\n📞 0956 064 1174\n📧 e-lawsolar@gmail.com')
    if (!confirm) return
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
    setSelectedOrder(null)
    alert('Your order has been cancelled. Please contact us at 0956 064 1174 or e-lawsolar@gmail.com to process your refund.')
  }

  const statusStyle = (status: string) => {
    if (status === 'pending') return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' }
    if (status === 'confirmed') return { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' }
    if (status === 'installed') return { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' }
    if (status === 'cancelled') return { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' }
    return { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: 'rgba(148,163,184,0.25)' }
  }

  const statusLabel = (status: string) => {
    if (status === 'pending') return '⏳ Pending'
    if (status === 'confirmed') return '✅ Confirmed'
    if (status === 'installed') return '⚡ Installed'
    if (status === 'cancelled') return '❌ Cancelled'
    return status
  }

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
        .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 0.6rem; letter-spacing: 0.03em; }
        .nav-logo-icon { width: 30px; height: 30px; background: var(--gold); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .nav-logo span { color: var(--gold); }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; }
        .nav-btn { padding: 0.5rem 1.1rem; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; border: none; }
        .nav-btn.outline { border: 1px solid var(--gold-border); background: transparent; color: var(--gold); }
        .nav-btn.outline:hover { background: var(--gold-dim); }
        .nav-btn.solid { background: var(--gold); color: var(--navy); font-weight: 600; }
        .nav-btn.solid:hover { opacity: 0.88; }
        .nav-btn.ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
        .nav-btn.ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }
        .nav-email { font-size: 0.82rem; color: var(--muted); }
        .container { max-width: 960px; margin: 0 auto; padding: 3rem 2rem; }
        .welcome-row { margin-bottom: 2.5rem; }
        .welcome { font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 0.35rem; }
        .welcome span { color: var(--gold); }
        .welcome-sub { color: var(--muted); font-size: 0.9rem; font-weight: 400; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .stat-card { background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; transition: border-color 0.2s; }
        .stat-card:hover { border-color: var(--gold-border); }
        .stat-label { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.5rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--gold); letter-spacing: -0.5px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; letter-spacing: 0.02em; margin-bottom: 1rem; color: var(--text); }
        .empty-card { background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 3.5rem; text-align: center; }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-text { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem; font-weight: 400; }
        .cta-btn { padding: 0.75rem 1.5rem; border-radius: 8px; border: none; background: var(--gold); color: var(--navy); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
        .cta-btn:hover { opacity: 0.88; }
        .order-card { background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 1.4rem 1.6rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; }
        .order-card:hover { border-color: var(--gold-border); transform: translateX(3px); }
        .order-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.01em; margin-bottom: 0.2rem; }
        .order-price { color: var(--muted); font-size: 0.82rem; font-weight: 400; }
        .order-date { font-size: 0.75rem; color: rgba(148,163,184,0.6); margin-top: 0.15rem; }
        .order-right { display: flex; align-items: center; gap: 0.75rem; }
        .status { padding: 0.3rem 0.85rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600; border: 1px solid; font-family: 'DM Sans', sans-serif; }
        .view-btn { font-size: 0.8rem; color: var(--gold); background: none; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 700; letter-spacing: 0.02em; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { background: var(--card2); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 2rem; width: 100%; max-width: 480px; box-shadow: 0 30px 80px rgba(0,0,0,0.6); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
        .modal-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; letter-spacing: -0.3px; }
        .close-btn { background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: var(--muted); font-size: 1rem; cursor: pointer; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .close-btn:hover { color: var(--text); background: rgba(255,255,255,0.1); }
        .modal-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 0.85rem 0; border-bottom: 1px solid var(--border); }
        .modal-row:last-of-type { border-bottom: none; }
        .modal-label { font-size: 0.82rem; color: var(--muted); font-weight: 400; }
        .modal-value { font-size: 0.85rem; font-weight: 600; text-align: right; max-width: 220px; }
        .modal-actions { display: flex; gap: 0.75rem; margin-top: 1.75rem; flex-wrap: wrap; }
        .cancel-btn { flex: 1; padding: 0.8rem; border-radius: 10px; border: 1px solid rgba(239,68,68,0.25); background: rgba(239,68,68,0.06); color: #f87171; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .cancel-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.4); }
        .close-modal-btn { flex: 1; padding: 0.8rem; border-radius: 10px; border: none; background: var(--gold); color: var(--navy); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .close-modal-btn:hover { opacity: 0.88; }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.25rem; }
          .nav-email { display: none; }
          .container { padding: 2rem 1.25rem; }
          .welcome { font-size: 1.4rem; }
          .stats { grid-template-columns: 1fr; }
          .order-card { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .order-right { width: 100%; justify-content: space-between; }
        }
      `}</style>

      <nav>
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">☀️</div>
          E-<span>LAW</span> Solar
        </a>
        <div className="nav-right">
          <span className="nav-email">{user?.email}</span>
          <button className="nav-btn ghost" onClick={() => router.push('/')}>Home</button>
          <button className="nav-btn solid" onClick={() => router.push('/packages')}>Buy Package</button>
          <button className="nav-btn outline" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="welcome-row">
          <div className="welcome">Welcome back, <span>{profile?.full_name?.split(' ')[0] || 'Customer'}</span> 👋</div>
          <div className="welcome-sub">Here's your E-LAW solar journey at a glance.</div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Orders</div>
            <div className="stat-value">{orders.filter(o => o.status !== 'cancelled').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Account Status</div>
            <div className="stat-value" style={{fontSize:'1rem', paddingTop:'0.4rem', color:'#34d399'}}>✅ Active</div>
          </div>
        </div>

        <div className="section-title">My Orders</div>

        {orders.length === 0 ? (
          <div className="empty-card">
            <div className="empty-icon">🌞</div>
            <p className="empty-text">No orders yet. Browse our solar packages and start saving!</p>
            <button className="cta-btn" onClick={() => router.push('/packages')}>View Packages →</button>
          </div>
        ) : (
          orders.map(order => {
            const ss = statusStyle(order.status)
            return (
              <div key={order.id} className="order-card" onClick={() => setSelectedOrder(order)}>
                <div>
                  <div className="order-name">{order.packages?.name}</div>
                  <div className="order-price">₱{order.packages?.price?.toLocaleString()}</div>
                  <div className="order-date">{new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
                <div className="order-right">
                  <span className="status" style={{ background: ss.bg, color: ss.color, borderColor: ss.border }}>{statusLabel(order.status)}</span>
                  <button className="view-btn">Details →</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {selectedOrder && (
        <div className="overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Order Details</div>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="modal-row">
              <span className="modal-label">Package</span>
              <span className="modal-value">{selectedOrder.packages?.name}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Amount</span>
              <span className="modal-value" style={{color:'var(--gold)'}}>₱{selectedOrder.packages?.price?.toLocaleString()}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Order ID</span>
              <span className="modal-value" style={{color:'var(--muted)', fontSize:'0.78rem'}}>#{selectedOrder.id}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Date Ordered</span>
              <span className="modal-value">{new Date(selectedOrder.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Status</span>
              <span className="modal-value" style={{color: statusStyle(selectedOrder.status).color}}>
                {selectedOrder.status === 'pending' && '⏳ Pending confirmation'}
                {selectedOrder.status === 'confirmed' && '✅ Confirmed — installation being scheduled'}
                {selectedOrder.status === 'installed' && '⚡ Installed — enjoy your solar!'}
                {selectedOrder.status === 'cancelled' && '❌ Cancelled'}
              </span>
            </div>
            <div className="modal-actions">
              {selectedOrder.status === 'pending' && (
                <div style={{width:'100%'}}>
                  <button className="cancel-btn" style={{width:'100%'}} onClick={() => handleCancel(selectedOrder.id)}>Cancel Order</button>
                  <p style={{fontSize:'0.72rem', color:'var(--muted)', textAlign:'center', marginTop:'0.5rem'}}>For refunds contact: 0956 064 1174</p>
                </div>
              )}
              <button className="close-modal-btn" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
