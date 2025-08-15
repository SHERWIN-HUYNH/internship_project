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
    console.log('VALUE FROM FLASK', data)
    if (!flaskRes.ok) {
        return NextResponse.json(
          { error: data.message || 'Authentication failed' },
          { status: flaskRes.status }
        )
      }

    const { access_token: token, expires_in = process.env.JWT_ACCESS_EXPIRES } = data

    const res = NextResponse.json(
      {
        success: true,
        user:  {
          account_id: data.account_id,
          name: data.userData.name,
          email: data.userData.email,
          role: data.userData.role,
          phone: data.userData.phone,
        },
      },
      { status: 200 }
    )
    
    

     res.cookies.set('access_token', token, {
      httpOnly: true,             
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',             
      maxAge: 86400,                      
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
