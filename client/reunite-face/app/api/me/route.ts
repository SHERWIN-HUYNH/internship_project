import { NextRequest, NextResponse } from 'next/server'

function decodeJwt<T = any>(token: string): T | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const json = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  if (!token) return NextResponse.json({ loggedIn: false })

  const payload = decodeJwt<any>(token)
  if (!payload) return NextResponse.json({ loggedIn: false })

  const name = payload.name
  const email = payload.email || payload.sub
  const role = payload.role

  return NextResponse.json({
    loggedIn: true,
    user: { name, email, role },
  })
}