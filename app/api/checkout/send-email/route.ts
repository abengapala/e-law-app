import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { customerName, customerEmail, customerPhone, packageName, price } = await req.json()

  try {
    // Email to admin
    await resend.emails.send({
      from: 'E-LAW Solar <onboarding@resend.dev>',
      to: 'ederalbertoabrazado28@gmail.com',
      subject: `🌞 New Order — ${packageName}`,
      html: `   
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; background: #0a0f1e; color: #e2e8f0; padding: 2rem; border-radius: 12px;">
          <h2 style="color: #f59e0b; margin-bottom: 1rem;">☀️ New Solar Order!</h2>
          <p style="color: #94a3b8; margin-bottom: 1.5rem;">A customer just placed an order. Here are the details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.75rem 0; color: #94a3b8; font-size: 0.9rem;">Customer</td>
              <td style="padding: 0.75rem 0; font-weight: 600;">${customerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.75rem 0; color: #94a3b8; font-size: 0.9rem;">Email</td>
              <td style="padding: 0.75rem 0; font-weight: 600;">${customerEmail}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.75rem 0; color: #94a3b8; font-size: 0.9rem;">Phone</td>
              <td style="padding: 0.75rem 0; font-weight: 600;">${customerPhone}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.75rem 0; color: #94a3b8; font-size: 0.9rem;">Package</td>
              <td style="padding: 0.75rem 0; font-weight: 600; color: #f59e0b;">${packageName}</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 0; color: #94a3b8; font-size: 0.9rem;">Amount</td>
              <td style="padding: 0.75rem 0; font-weight: 600; color: #6ee7b7;">₱${Number(price).toLocaleString()}</td>
            </tr>
          </table>
          <a href="https://e-law-app.vercel.app/admin" style="display: inline-block; margin-top: 1.5rem; background: #f59e0b; color: #0a0f1e; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 700;">View in Admin Panel →</a>
        </div>
      `
    })

    // Confirmation email to customer
    await resend.emails.send({
      from: 'E-LAW Solar <onboarding@resend.dev>',
      to: customerEmail,
      subject: `✅ Order Confirmed — ${packageName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; background: #0a0f1e; color: #e2e8f0; padding: 2rem; border-radius: 12px;">
          <h2 style="color: #6ee7b7; margin-bottom: 1rem;">🎉 Thank you, ${customerName}!</h2>
          <p style="color: #94a3b8; margin-bottom: 1.5rem;">Your order has been received. Our team will contact you within 24 hours to schedule your installation.</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.75rem 0; color: #94a3b8; font-size: 0.9rem;">Package</td>
              <td style="padding: 0.75rem 0; font-weight: 600; color: #f59e0b;">${packageName}</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 0; color: #94a3b8; font-size: 0.9rem;">Amount</td>
              <td style="padding: 0.75rem 0; font-weight: 600; color: #6ee7b7;">₱${Number(price).toLocaleString()}</td>
            </tr>
          </table>
          <p style="color: #94a3b8; margin-top: 1.5rem; font-size: 0.9rem;">Questions? Contact us at <strong style="color: #f59e0b;">e-lawsolar@gmail.com</strong> or call <strong style="color: #f59e0b;">0956 064 1174</strong></p>
          <p style="color: #64748b; margin-top: 1rem; font-size: 0.8rem;">— E-LAW Solar Team ☀️</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}