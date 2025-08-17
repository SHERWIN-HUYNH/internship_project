import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/api/',
  '/favicon.ico',
]

const RESTRICTED_PATHS: Record<string, string[]> = {
  admin: ['/admin'],
  user: [
    '/missingreport',
    '/account/:path*',
  ],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths without token check
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get access token from cookies
  const accessToken = req.cookies.get('access_token')?.value
  console.log('MIDDLEWARE ACCESS TOKEN', accessToken)
  if (!accessToken) {
    console.log('NO ACCESS TOKEN')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY!)
    const { payload } = await jwtVerify(accessToken, secret)
    const role = payload.role // Access role directly from payload
    console.log('MIDDLEWARE ROLE', role)

    // Check if the role exists and the path is allowed
    const allowedPaths = RESTRICTED_PATHS[role as string] || []
    const isAllowed = allowedPaths.some((p) => 
      p.includes(':path*') 
        ? pathname.startsWith(p.split('/:path*')[0]) 
        : pathname.startsWith(p)
    )

    if (!role || !isAllowed) {
      console.log('UNAUTHORIZED ACCESS: Invalid role or path')
      return NextResponse.redirect(new URL('/login', req.url))
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
    // '/missingreport',
    '/account/:path*',
  ],
}