import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { packageName, price, packageId, userId } = await req.json()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const response = await fetch('https://api.paymongo.com/v1/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: price * 100,
          description: `E-LAW Solar — ${packageName}`,
          remarks: `userId:${userId}|packageId:${packageId}`,
          redirect: {
            success: `${appUrl}/success`,
            failed: `${appUrl}/packages`
          }
        }
      }
    })
  })

  const data = await response.json()
  const checkoutUrl = data.data?.attributes?.checkout_url

  if (!checkoutUrl) {
    return NextResponse.json({ error: 'Failed to create payment link' }, { status: 500 })
  }

  return NextResponse.json({ url: checkoutUrl })
}