// pages/api/auth/[action].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import { NextRequest, NextResponse } from 'next/server'

const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_API_URL

export async function POST(request: NextRequest) {
  try {
     const payload = await request.json()

    const flaskRes = await fetch(`${FLASK_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    
    const data = await flaskRes.json()

    if (!flaskRes.ok) {
        return NextResponse.json(
          { error: data.message || 'Authentication failed' },
          { status: flaskRes.status }
        )
      }

     const token = data.access_token || data.token
    if (!token) {
      return NextResponse.json({ error: 'Missing token from backend' }, { status: 500 })
    }

    const fallback = 60 * 60 * 24 * 7
    const rawExp = data.expires_in ?? process.env.JWT_ACCESS_EXPIRES
    const maxAge = typeof rawExp === 'string' ? parseInt(rawExp, 10) : (rawExp ?? fallback)

    const res = NextResponse.json(
      {
        success: true,
        user:  {
          account_id: data.account_id,
          name: data.userData?.name || payload.name,
          email: data.userData?.email || payload.email,
          role: data.userData?.role || payload.role || 'user',
          phone: payload.phone ?? '',
        },
      },
      { status: 201 }
    )

    res.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    })

    return res

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
