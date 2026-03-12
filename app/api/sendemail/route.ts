import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { customerName, customerEmail, customerPhone, packageName, price } = await req.json()

  console.log('=== SEND EMAIL CALLED ===')
  console.log('API KEY:', process.env.RESEND_API_KEY ? 'EXISTS' : 'MISSING!')

  try {
    // Only send to your own email (Resend free plan restriction)
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ederalbertoabrazado28@gmail.com',
      subject: `🌞 New Order — ${packageName}`,
      html: `
        <div style="font-family: sans-serif; padding: 2rem; background: #0a0f1e; color: #e2e8f0; border-radius: 12px;">
          <h2 style="color: #f59e0b;">☀️ New Solar Order!</h2>
          <p style="color: #94a3b8;">A customer just placed an order:</p>
          <table style="width: 100%; margin-top: 1rem;">
            <tr><td style="color: #94a3b8; padding: 0.5rem 0;">Customer</td><td style="font-weight: 600;">${customerName}</td></tr>
            <tr><td style="color: #94a3b8; padding: 0.5rem 0;">Email</td><td style="font-weight: 600;">${customerEmail}</td></tr>
            <tr><td style="color: #94a3b8; padding: 0.5rem 0;">Phone</td><td style="font-weight: 600;">${customerPhone}</td></tr>
            <tr><td style="color: #94a3b8; padding: 0.5rem 0;">Package</td><td style="font-weight: 600; color: #f59e0b;">${packageName}</td></tr>
            <tr><td style="color: #94a3b8; padding: 0.5rem 0;">Amount</td><td style="font-weight: 600; color: #6ee7b7;">₱${Number(price).toLocaleString()}</td></tr>
          </table>
          <a href="https://e-law-app.vercel.app/admin" style="display: inline-block; margin-top: 1.5rem; background: #f59e0b; color: #0a0f1e; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 700;">View in Admin Panel →</a>
        </div>
      `
    })

    console.log('Resend result:', JSON.stringify(result))
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}