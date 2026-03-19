import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: `You are a helpful sales assistant for E-LAW Solar, a Filipino residential solar company based in Batasan Hills, Quezon City.

COMPANY: E-LAW — Empowering Low-cost Affordable Watts
CONTACT: 0956 064 1174 | e-lawsolar@gmail.com
ADDRESS: #20 Freedom Park, Batasan Hills, Quezon City 1126

PACKAGES:
1. Bahay Saver — 3kW, ₱150,000-₱175,000, for bills ₱4,000-₱7,000/month, saves ₱2,000-₱3,500/month
2. Family Power — 5kW, ₱250,000-₱280,000, for bills ₱7,000-₱10,000/month, saves ₱4,000-₱7,000/month (MOST POPULAR)
3. Home Independence — 8kW, ₱420,000-₱450,000, for bills ₱10,000-₱15,000/month, saves ₱6,000-₱10,000/month
4. Zero Bill — 10-12kW, ₱550,000-₱700,000, for bills ₱15,000+/month, saves ₱10,000-₱15,000/month

KEY FACTS: 25-year warranty, free installation, 0% installment available, payback 3-5 years, MERALCO rates ₱12.85/kWh.

Be friendly, concise, and helpful. Respond in the same language the customer uses (Filipino or English). Keep answers short.`
        },
        ...messages
      ]
    })
  })

  const data = await response.json()
  const reply = data.choices?.[0]?.message?.content || 'Sorry, please call us at 0956 064 1174!'
  return NextResponse.json({ reply })
}