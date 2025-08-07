// pages/api/auth/[action].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import { NextRequest, NextResponse } from 'next/server'

const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_API_URL

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Forward request to Flask
    const flaskRes = await fetch(`${FLASK_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await flaskRes.json()

    if (!flaskRes.ok) {
        return NextResponse.json(
          { error: data.message || 'Authentication failed' },
          { status: flaskRes.status }
        )
      }

    const { access_token: token, expires_in = 60 * 60 * 24 * 7 } = data

    // 5. Build Set-Cookie header
    const cookieHeader = serialize('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expires_in,
      path: '/',
    })

    // 6. Return success with cookie
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookieHeader,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
