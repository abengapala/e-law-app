import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { packageName, price, packageId, userId } = await req.json()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
    },
    body: JSON.stringify({
      data: {
        attributes: {
          send_email_receipt: false,
          show_description: true,
          show_line_items: true,
          line_items: [
            {
              currency: 'PHP',
              amount: price * 100,
              name: `E-LAW Solar — ${packageName}`,
              quantity: 1,
            }
          ],
          payment_method_types: ['card', 'gcash', 'paymaya'],
          success_url: `${appUrl}/success`,
          cancel_url: `${appUrl}/packages`,
          metadata: {
            userId: userId,
            packageId: String(packageId)
          }
        }
      }
    })
  })

  const data = await response.json()
  const checkoutUrl = data.data?.attributes?.checkout_url

  if (!checkoutUrl) {
    return NextResponse.json({ error: 'Failed to create payment link', details: data }, { status: 500 })
  }

  return NextResponse.json({ url: checkoutUrl })
}