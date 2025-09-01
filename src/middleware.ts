import { MiddlewareConfig, NextRequest, NextResponse } from "next/server"

const publicRoutes = [
    { path: '/login', whenAuthenticated: 'redirect'},
    { path: '/sign-up', whenAuthenticated: 'redirect'},
    { path: '/', whenAuthenticated: 'next'},
    { path: '/home', whenAuthenticated: 'next'},
    { path: '/leiloes', whenAuthenticated: 'next'},
    { path: '/categorias', whenAuthenticated: 'next'},
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login"

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const publicRoute = publicRoutes.find(route => route.path === path)
    const authToken = request.cookies.get('usuario')

    if (authToken && publicRoute) {
        return NextResponse.next()
    }

    if (!authToken && !publicRoute) {
        const redirecturl = request.nextUrl.clone()
        redirecturl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

        return NextResponse.redirect(redirecturl)
    }

    if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
        const redirecturl = request.nextUrl.clone()
        redirecturl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

        return NextResponse.redirect(redirecturl)
    }

    if (authToken && !publicRoute) {
        // aqui é validar se o token foi expirado ou não
        return NextResponse.next()
    }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}