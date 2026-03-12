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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(profileData)

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, packages(name, price, description)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      setOrders(ordersData || [])
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCancel = async (orderId: number) => {
    const confirm = window.confirm(
      'Are you sure you want to cancel this order?\n\nFor refunds, please contact us:\n📞 0956 064 1174\n📧 e-lawsolar@gmail.com'
    )
    if (!confirm) return
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
    setSelectedOrder(null)
    alert('Your order has been cancelled. Please contact us at 0956 064 1174 or e-lawsolar@gmail.com to process your refund.')
  }

  const getStatusColor = (status: string) => {
    if (status === 'pending') return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
    if (status === 'confirmed') return { bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }
    if (status === 'installed') return { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }
    if (status === 'cancelled') return { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5' }
    return { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0f1e; color: #e2e8f0; }
        .nav { background: #161d2e; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: #f59e0b; cursor: pointer; }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .user-email { font-size: 0.85rem; color: #94a3b8; }
        .nav-btn { padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid rgba(245,158,11,0.3); background: transparent; color: #f59e0b; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .nav-btn:hover { background: rgba(245,158,11,0.1); }
        .nav-btn.solid { background: #f59e0b; color: #0a0f1e; border-color: #f59e0b; }
        .nav-btn.solid:hover { opacity: 0.85; }
        .container { max-width: 900px; margin: 0 auto; padding: 2.5rem 1.5rem; }
        .welcome { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
        .welcome span { color: #f59e0b; }
        .sub { color: #94a3b8; font-size: 0.9rem; margin-bottom: 2.5rem; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .stat-card { background: #161d2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.5rem; }
        .stat-label { font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; color: #f59e0b; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
        .empty-card { background: #161d2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 3rem; text-align: center; }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-text { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
        .cta-btn { padding: 0.75rem 1.5rem; border-radius: 8px; border: none; background: #f59e0b; color: #0a0f1e; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: opacity 0.2s; }
        .cta-btn:hover { opacity: 0.85; }
        .order-card { background: #161d2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: border-color 0.2s; }
        .order-card:hover { border-color: rgba(245,158,11,0.3); }
        .order-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; }
        .order-price { color: #94a3b8; font-size: 0.85rem; margin-top: 0.25rem; }
        .order-date { font-size: 0.75rem; color: #64748b; margin-top: 0.25rem; }
        .order-right { display: flex; align-items: center; gap: 0.75rem; }
        .status { padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.8rem; font-weight: 500; }
        .view-btn { font-size: 0.8rem; color: #f59e0b; background: none; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 700; }

        /* MODAL */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { background: #161d2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2rem; width: 100%; max-width: 480px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-title { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; }
        .close-btn { background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; line-height: 1; }
        .close-btn:hover { color: #e2e8f0; }
        .modal-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .modal-row:last-of-type { border-bottom: none; }
        .modal-label { font-size: 0.85rem; color: #94a3b8; }
        .modal-value { font-size: 0.85rem; font-weight: 600; text-align: right; }
        .modal-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap; }
        .cancel-btn { flex: 1; padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(239,68,68,0.3); background: transparent; color: #fca5a5; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .cancel-btn:hover { background: rgba(239,68,68,0.1); }
        .cancel-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .close-modal-btn { flex: 1; padding: 0.75rem; border-radius: 8px; border: none; background: #f59e0b; color: #0a0f1e; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: opacity 0.2s; }
        .close-modal-btn:hover { opacity: 0.85; }

        @media (max-width: 768px) {
          .nav { padding: 1rem; flex-wrap: wrap; gap: 0.5rem; }
          .nav-right { gap: 0.5rem; }
          .user-email { display: none; }
          .container { padding: 1.5rem 1rem; }
          .welcome { font-size: 1.25rem; }
          .stats { grid-template-columns: 1fr; }
          .order-card { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .order-right { width: 100%; justify-content: space-between; }
        }
      `}</style>

      <nav className="nav">
        <div className="logo" onClick={() => router.push('/')}>☀️ E-LAW Solar</div>
        <div className="nav-right">
          <span className="user-email">{user?.email}</span>
          <button className="nav-btn" onClick={() => router.push('/')}>🏠 Home</button>
          <button className="nav-btn solid" onClick={() => router.push('/packages')}>Buy Package</button>
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="welcome">
          Welcome back, <span>{profile?.full_name?.split(' ')[0] || 'Customer'}</span> 👋
        </div>
        <p className="sub">Here's your E-LAW solar journey at a glance.</p>

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
            <div className="stat-value" style={{fontSize: '1rem', paddingTop: '0.4rem'}}>✅ Active</div>
          </div>
        </div>

        <div className="section-title">My Orders</div>

        {orders.length === 0 ? (
          <div className="empty-card">
            <div className="empty-icon">🌞</div>
            <p className="empty-text">No orders yet. Browse our solar packages and start saving!</p>
            <button className="cta-btn" onClick={() => router.push('/packages')}>
              View Packages →
            </button>
          </div>
        ) : (
          orders.map(order => {
            const sc = getStatusColor(order.status)
            return (
              <div key={order.id} className="order-card" onClick={() => setSelectedOrder(order)}>
                <div>
                  <div className="order-name">{order.packages?.name}</div>
                  <div className="order-price">₱{order.packages?.price?.toLocaleString()}</div>
                  <div className="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="order-right">
                  <span className="status" style={{ background: sc.bg, color: sc.color }}>
                    {order.status}
                  </span>
                  <button className="view-btn">View →</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Order Details</div>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>

            <div className="modal-row">
              <span className="modal-label">Package</span>
              <span className="modal-value">{selectedOrder.packages?.name}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Amount Paid</span>
              <span className="modal-value" style={{color:'#f59e0b'}}>₱{selectedOrder.packages?.price?.toLocaleString()}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Order ID</span>
              <span className="modal-value" style={{color:'#64748b'}}>#{selectedOrder.id}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Date Ordered</span>
              <span className="modal-value">
                {new Date(selectedOrder.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Status</span>
              <span className="modal-value" style={{color: getStatusColor(selectedOrder.status).color}}>
                {selectedOrder.status === 'pending' && '⏳ Pending confirmation'}
                {selectedOrder.status === 'confirmed' && '✅ Confirmed — installation being scheduled'}
                {selectedOrder.status === 'installed' && '⚡ Installed — enjoy your solar!'}
                {selectedOrder.status === 'cancelled' && '❌ Cancelled'}
              </span>
            </div>

            <div className="modal-actions">
            {selectedOrder.status === 'pending' && (
  <div style={{width:'100%'}}>
    <button className="cancel-btn" style={{width:'100%'}} onClick={() => handleCancel(selectedOrder.id)}>
      Cancel Order
    </button>
    <p style={{fontSize:'0.75rem', color:'#64748b', textAlign:'center', marginTop:'0.5rem'}}>
      For refunds contact us: 0956 064 1174
    </p>
  </div>
)}
              <button className="close-modal-btn" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}