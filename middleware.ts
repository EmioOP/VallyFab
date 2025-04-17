import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl
        const token = req.nextauth.token

        // Handle authenticated users on auth pages
        if (token && (pathname === "/login" || pathname === "/register")) {
            return NextResponse.redirect(new URL("/", req.url)) // Redirect to home
        }

        // Handle admin routes
        if (pathname.startsWith("/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url))
        }
        // if (token?.role === "admin" && pathname.startsWith("/admin") === false) {
        //     return NextResponse.redirect(new URL("/admin", req.url))
        // }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl
            
                // Public routes
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname.startsWith("/api/webhook") ||
                    pathname.startsWith("/api/products/") ||
                    pathname.startsWith("/shop") ||
                    pathname === "/" ||
                    pathname.startsWith("/api/blogs/") ||
                    pathname.startsWith("/blogs")
                ) {
                    return true
                }
                // Admin route protection
                if (pathname.startsWith("/admin")) {
                    return token?.role === "admin"
                }
                // All other routes are public
                return true
            }
        },
    },
)

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
    ]
}