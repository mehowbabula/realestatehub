import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Check if user has required role for protected routes
    if (pathname.startsWith('/add-listing')) {
      const userRole = token?.role as string
      if (!userRole || !['agent', 'admin'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard?error=insufficient-permissions', req.url))
      }
    }

    // Admin-only routes
    if (pathname.startsWith('/admin')) {
      const userRole = token?.role as string
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard?error=admin-required', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/properties',
          '/agents',
          '/blog',
          '/pricing',
          '/api/listings',
          '/api/health'
        ]
        
        // Check if route is public
        if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
          return true
        }

        // Protected routes require authentication
        const protectedRoutes = [
          '/dashboard',
          '/profile',
          '/settings',
          '/add-listing',
          '/admin',
          '/ai-matching',
          '/invest',
          '/rewards',
          '/community',
          '/forecast'
        ]

        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          return !!token
        }

        // Default to requiring auth for unknown routes
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|robots.txt).*)',
  ],
}
