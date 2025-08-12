// middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/api/',
  '/favicon.ico',
]

const RESTRICTED_PATHS: Record<string, string[]> = {
  ADMIN: ['/admin'],
  USER: [
    '/missingReport',
    '/account/:path*',
  ],
}


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const accessToken = req.cookies.get('access_token')?.value
  console.log('MIDDLEWARE ACCESS TOKEN', accessToken)
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    console.log('1')
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY!)
    const { payload } = await jwtVerify(accessToken, secret)
    const role = (payload as any).role
    console.log('ROLE', role)
    console.log('PAYLOAD', payload)
    console.log('2')
    

    const allowedPaths = RESTRICTED_PATHS[role] || []
    const isAllowed = allowedPaths.some((p) => pathname.startsWith(p))

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/403', req.url))
    }

    return NextResponse.next()
  } catch (err) {
    console.error('Token invalid or expired:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/missingReport',
    '/account/:path*',
  ],
}
