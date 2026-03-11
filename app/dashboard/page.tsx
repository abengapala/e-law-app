'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      setUser(session.user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(profileData)

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, packages(name, price)')
        .eq('user_id', session.user.id)
      setOrders(ordersData || [])
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0f1e; color: #e2e8f0; }
        .nav {
          background: #161d2e; border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;
        }
        .logo { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: #f59e0b; }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .user-email { font-size: 0.85rem; color: #94a3b8; }
        .logout-btn {
          padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid rgba(245,158,11,0.3);
          background: transparent; color: #f59e0b; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
        }
        .logout-btn:hover { background: rgba(245,158,11,0.1); }
        .container { max-width: 900px; margin: 0 auto; padding: 2.5rem 1.5rem; }
        .welcome { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
        .welcome span { color: #f59e0b; }
        .sub { color: #94a3b8; font-size: 0.9rem; margin-bottom: 2.5rem; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .stat-card {
          background: #161d2e; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 1.5rem;
        }
        .stat-label { font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; color: #f59e0b; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
        .empty-card {
          background: #161d2e; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 3rem; text-align: center;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-text { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
        .cta-btn {
          padding: 0.75rem 1.5rem; border-radius: 8px; border: none;
          background: #f59e0b; color: #0a0f1e;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 0.9rem; cursor: pointer; transition: opacity 0.2s;
        }
        .cta-btn:hover { opacity: 0.85; }
        .order-card {
          background: #161d2e; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .order-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; }
        .order-price { color: #94a3b8; font-size: 0.85rem; margin-top: 0.25rem; }
        .status {
          padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.8rem; font-weight: 500;
        }
        .status.pending { background: rgba(245,158,11,0.15); color: #f59e0b; }
        .status.confirmed { background: rgba(16,185,129,0.15); color: #6ee7b7; }
        .status.installed { background: rgba(99,102,241,0.15); color: #a5b4fc; }
      `}</style>

      <nav className="nav">
        <div className="logo">☀️ E-LAW Solar</div>
        <div className="nav-right">
          <span className="user-email">{user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
            <div className="stat-label">Est. Monthly Savings</div>
            <div className="stat-value">₱{orders.length > 0 ? '1,500' : '0'}</div>
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
            <button className="cta-btn" onClick={() => router.push('/#packages')}>
              View Packages →
            </button>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div>
                <div className="order-name">{order.packages?.name}</div>
                <div className="order-price">₱{order.packages?.price?.toLocaleString()}</div>
              </div>
              <span className={`status ${order.status}`}>{order.status}</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}