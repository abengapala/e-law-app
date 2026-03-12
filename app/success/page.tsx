'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const [count, setCount] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          router.replace('/dashboard') // replace instead of push so back button skips this
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0f1e; color: #e2e8f0; }
        .page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;
          background: radial-gradient(ellipse 60% 60% at 50% 40%, rgba(16,185,129,0.12) 0%, transparent 70%); }
        .card { background: #161d2e; border: 1px solid rgba(16,185,129,0.3); border-radius: 24px; padding: 3rem; text-align: center; max-width: 480px; width: 100%; }
        .icon { font-size: 4rem; margin-bottom: 1.5rem; }
        .title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #6ee7b7; margin-bottom: 1rem; }
        .desc { color: #94a3b8; font-size: 0.95rem; line-height: 1.7; margin-bottom: 2rem; }
        .counter { 
          font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; 
          color: #f59e0b; margin-bottom: 0.5rem; 
        }
        .redirect-note { color: #64748b; font-size: 0.85rem; margin-bottom: 1.5rem; }
        .btn {
          padding: 0.875rem 2rem; border-radius: 10px; border: none;
          background: #f59e0b; color: #0a0f1e; font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: opacity 0.2s; margin: 0.5rem;
          display: inline-block;
        }
        .btn:hover { opacity: 0.85; }
        .btn.outline { background: transparent; border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; }
        .btn.outline:hover { background: rgba(245,158,11,0.1); }
      `}</style>
      <div className="page">
        <div className="card">
          <div className="icon">🎉</div>
          <div className="title">Payment Successful!</div>
          <p className="desc">
            Thank you for choosing E-LAW Solar! Your order has been received.
            Our team will contact you within 24 hours to schedule your installation.
          </p>
          <div className="counter">{count}</div>
          <p className="redirect-note">Redirecting to your dashboard...</p>
          <div>
            <button className="btn" onClick={() => router.replace('/dashboard')}>
              Go to Dashboard Now →
            </button>
          </div>
          <div style={{marginTop: '0.5rem'}}>
            <button className="btn outline" onClick={() => router.replace('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}