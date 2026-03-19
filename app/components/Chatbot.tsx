'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m the E-LAW Solar assistant 🌞 How can I help you today? Ask me about our packages, pricing, installation, or savings!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a helpful sales assistant for E-LAW Solar, a Filipino residential solar company based in Batasan Hills, Quezon City, Metro Manila.

COMPANY INFO:
- Full name: E-LAW — Empowering Low-cost Affordable Watts
- Contact: 0956 064 1174 | e-lawsolar@gmail.com
- Location: #20 Freedom Park, Batasan Hills, Quezon City 1126
- Facebook: m.me/elawsolar

PACKAGES:
1. Bahay Saver — 3kW, 6 panels, ₱150,000-₱175,000, for bills ₱4,000-₱7,000/month, saves ₱2,000-₱3,500/month
2. Family Power — 5kW, 10 panels, ₱250,000-₱280,000, for bills ₱7,000-₱10,000/month, saves ₱4,000-₱7,000/month (MOST POPULAR)
3. Home Independence — 8kW, 16 panels, ₱420,000-₱450,000, for bills ₱10,000-₱15,000/month, saves ₱6,000-₱10,000/month
4. Zero Bill — 10-12kW, 22 panels, ₱550,000-₱700,000, for bills ₱15,000+/month, saves ₱10,000-₱15,000/month

KEY FACTS:
- Tier 1 monocrystalline solar panels
- 25-year performance warranty on panels
- Free installation included
- Payback period: 3-5 years
- MERALCO rates: ₱12.85/kWh average
- Payment options: 0% installment, bank financing, rent-to-own
- Service areas: Metro Manila, Quezon City, Makati, Pasig, Cavite, Laguna, Rizal, Bulacan
- Net Metering available — sell excess power back to grid

Be friendly, helpful, and speak naturally. Keep answers concise. If asked about booking a consultation, direct them to call 0956 064 1174 or message on Facebook. Always respond in the same language the customer uses (Filipino or English).`,
          messages: messages.concat([{ role: 'user', content: userMessage }]).slice(1).map(m => ({ role: m.role, content: m.content }))
        })
      })

      const data = await response.json()
      const reply = data.content?.[0]?.text || 'Sorry, I could not get a response. Please call us at 0956 064 1174!'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please call us at 0956 064 1174 or message us on Facebook!' }])
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');
        .chat-toggle {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 1000;
          width: 52px; height: 52px; border-radius: 50%;
          background: #1AA3DE; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; box-shadow: 0 4px 20px rgba(26,163,222,0.4);
          transition: all 0.2s;
        }
        .chat-toggle:hover { transform: scale(1.08); box-shadow: 0 6px 25px rgba(26,163,222,0.5); }
        .chat-window {
          position: fixed; bottom: 5rem; right: 1.5rem; z-index: 1000;
          width: 340px; height: 480px;
          background: #0E1C29; border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px; display: flex; flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          font-family: 'DM Sans', sans-serif;
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        .chat-header {
          background: #1AA3DE; border-radius: 14px 14px 0 0;
          padding: 0.85rem 1.1rem; display: flex; justify-content: space-between; align-items: center;
        }
        .chat-header-left { display: flex; align-items: center; gap: 0.6rem; }
        .chat-avatar { width: 30px; height: 30px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
        .chat-header-name { font-size: 0.85rem; font-weight: 600; color: #fff; }
        .chat-header-status { font-size: 0.68rem; color: rgba(255,255,255,0.75); }
        .chat-close { background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.1rem; cursor: pointer; padding: 0.2rem; line-height: 1; }
        .chat-close:hover { color: #fff; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.65rem; }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .msg { max-width: 82%; padding: 0.6rem 0.85rem; border-radius: 10px; font-size: 0.82rem; line-height: 1.55; }
        .msg.user { background: #1AA3DE; color: #fff; align-self: flex-end; border-radius: 10px 10px 3px 10px; }
        .msg.assistant { background: #132030; color: rgba(255,255,255,0.85); align-self: flex-start; border-radius: 10px 10px 10px 3px; border: 1px solid rgba(255,255,255,0.07); }
        .msg.typing { color: rgba(255,255,255,0.4); font-style: italic; }
        .chat-input-row { padding: 0.75rem; border-top: 1px solid rgba(255,255,255,0.07); display: flex; gap: 0.5rem; }
        .chat-input { flex: 1; padding: 0.6rem 0.85rem; background: #132030; border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; outline: none; transition: border-color 0.2s; }
        .chat-input:focus { border-color: #1AA3DE; }
        .chat-input::placeholder { color: rgba(255,255,255,0.25); }
        .chat-send { width: 34px; height: 34px; background: #1AA3DE; border: none; border-radius: 8px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; transition: all 0.2s; flex-shrink: 0; }
        .chat-send:hover { background: #1591c7; }
        .chat-send:disabled { opacity: 0.45; cursor: not-allowed; }
        @media (max-width: 768px) {
          .chat-window { width: calc(100vw - 2rem); right: 1rem; bottom: 5rem; height: 420px; }
        }
      `}</style>

      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar">☀️</div>
              <div>
                <div className="chat-header-name">E-LAW Solar Assistant</div>
                <div className="chat-header-status">● Online — Ask me anything!</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>{msg.content}</div>
            ))}
            {loading && <div className="msg assistant typing">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask about packages, pricing..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="chat-send" onClick={sendMessage} disabled={loading || !input.trim()}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
