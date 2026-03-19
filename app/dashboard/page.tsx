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

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  const handleCancel = async (orderId: number) => {
    const confirm = window.confirm('Are you sure you want to cancel this order?\n\nFor refunds, please contact us:\n📞 0956 064 1174\n📧 e-lawsolar@gmail.com')
    if (!confirm) return
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
    setSelectedOrder(null)
    alert('Your order has been cancelled. Please contact us at 0956 064 1174 or e-lawsolar@gmail.com to process your refund.')
  }

  const statusStyle = (s: string) => {
    if (s === 'pending') return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' }
    if (s === 'confirmed') return { bg: 'rgba(26,163,222,0.1)', color: '#1AA3DE', border: 'rgba(26,163,222,0.2)' }
    if (s === 'installed') return { bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.2)' }
    if (s === 'cancelled') return { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' }
    return { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' }
  }

  const statusLabel = (s: string) => {
    if (s === 'pending') return '⏳ Pending'
    if (s === 'confirmed') return '✅ Confirmed'
    if (s === 'installed') return '⚡ Installed'
    if (s === 'cancelled') return '❌ Cancelled'
    return s
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
        .nav-btn.ghost { background: transparent; color: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.1); }
        .nav-btn.ghost:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
        .nav-btn.outline { border: 1px solid rgba(26,163,222,0.3); background: transparent; color: #1AA3DE; }
        .nav-btn.outline:hover { background: rgba(26,163,222,0.08); }
        .nav-btn.solid { background: #1AA3DE; color: #fff; }
        .nav-btn.solid:hover { background: #1591c7; }
        .nav-email { font-size: 0.78rem; color: rgba(255,255,255,0.35); }
        .container { max-width: 920px; margin: 0 auto; padding: 3rem 2rem; }
        .welcome { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 700; letter-spacing: -0.2px; margin-bottom: 0.3rem; }
        .welcome span { color: #1AA3DE; }
        .welcome-sub { color: rgba(255,255,255,0.4); font-size: 0.83rem; margin-bottom: 2.5rem; font-family: 'DM Sans', sans-serif; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .stat-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 1.35rem 1.5rem; transition: border-color 0.2s; }
        .stat-card:hover { border-color: rgba(26,163,222,0.2); }
        .stat-label { font-size: 0.68rem; color: rgba(255,255,255,0.38); margin-bottom: 0.45rem; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
        .stat-value { font-family: 'DM Sans', sans-serif; font-size: 1.75rem; font-weight: 500; color: #1AA3DE; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 0.88rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.85rem; color: rgba(255,255,255,0.6); text-transform: uppercase; }
        .empty-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 3.5rem; text-align: center; }
        .empty-icon { font-size: 2.5rem; margin-bottom: 0.85rem; }
        .empty-text { color: rgba(255,255,255,0.4); font-size: 0.85rem; margin-bottom: 1.5rem; font-family: 'DM Sans', sans-serif; }
        .cta-btn { padding: 0.7rem 1.5rem; border-radius: 6px; border: none; background: #1AA3DE; color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .cta-btn:hover { background: #1591c7; }
        .order-card { background: #132030; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 1.25rem 1.5rem; margin-bottom: 0.65rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; }
        .order-card:hover { border-color: rgba(26,163,222,0.2); transform: translateX(2px); }
        .order-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.01em; margin-bottom: 0.18rem; }
        .order-price { color: rgba(255,255,255,0.45); font-size: 0.78rem; }
        .order-date { font-size: 0.72rem; color: rgba(255,255,255,0.28); margin-top: 0.12rem; font-family: 'DM Sans', sans-serif; }
        .order-right { display: flex; align-items: center; gap: 0.75rem; }
        .status { padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.7rem; font-weight: 500; border: 1px solid; font-family: 'DM Sans', sans-serif; }
        .view-btn { font-size: 0.75rem; color: #1AA3DE; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { background: #132030; border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 2rem; width: 100%; max-width: 460px; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; letter-spacing: -0.2px; }
        .close-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); font-size: 0.9rem; cursor: pointer; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .close-btn:hover { color: #fff; }
        .modal-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .modal-row:last-of-type { border-bottom: none; }
        .modal-label { font-size: 0.78rem; color: rgba(255,255,255,0.38); font-family: 'DM Sans', sans-serif; }
        .modal-value { font-size: 0.82rem; font-weight: 500; text-align: right; max-width: 210px; font-family: 'DM Sans', sans-serif; }
        .modal-actions { display: flex; gap: 0.65rem; margin-top: 1.5rem; flex-wrap: wrap; }
        .cancel-btn { flex: 1; padding: 0.75rem; border-radius: 7px; border: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.05); color: rgba(248,113,113,0.8); font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; }
        .cancel-btn:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.35); }
        .close-modal-btn { flex: 1; padding: 0.75rem; border-radius: 7px; border: none; background: #1AA3DE; color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; }
        .close-modal-btn:hover { background: #1591c7; }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.25rem; }
          .nav-email { display: none; }
          .container { padding: 2rem 1.25rem; }
          .welcome { font-size: 1.3rem; }
          .stats { grid-template-columns: 1fr; }
          .order-card { flex-direction: column; align-items: flex-start; gap: 0.65rem; }
          .order-right { width: 100%; justify-content: space-between; }
        }
      `}</style>

      <nav>
        <a href="/" className="nav-logo">
          <img src="/logo.png" alt="E-LAW Solar" style={{width:'auto', height:'80px', borderRadius:'6px', objectFit:'contain'}} />
        </a>
        <div className="nav-right">
          <span className="nav-email">{user?.email}</span>
          <button className="nav-btn ghost" onClick={() => router.push('/')}>Home</button>
          <button className="nav-btn solid" onClick={() => router.push('/packages')}>Buy Package</button>
          <button className="nav-btn outline" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="welcome">Welcome back, <span>{profile?.full_name?.split(' ')[0] || 'Customer'}</span> 👋</div>
        <div className="welcome-sub">Here's your E-LAW solar journey at a glance.</div>

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
            <div className="stat-value" style={{fontSize:'0.95rem', paddingTop:'0.3rem', color:'#34d399'}}>✅ Active</div>
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
              <span className="modal-value" style={{color:'#1AA3DE'}}>₱{selectedOrder.packages?.price?.toLocaleString()}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Order ID</span>
              <span className="modal-value" style={{color:'rgba(255,255,255,0.28)', fontSize:'0.75rem'}}>#{selectedOrder.id}</span>
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
                  <p style={{fontSize:'0.68rem', color:'rgba(255,255,255,0.28)', textAlign:'center', marginTop:'0.4rem', fontFamily:'DM Sans, sans-serif'}}>For refunds contact: 0956 064 1174</p>
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
