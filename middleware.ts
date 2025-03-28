import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware() {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl
                 // Redirect logged-in users from login/register pages
                 if ((pathname === "/login" || pathname === "/register") && token) {
                    return false
                }

                // Public routes
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname.startsWith("/api/webhook") ||
                    pathname.startsWith("/api/products") ||
                    pathname.startsWith("/shop") ||
                    pathname === "/" ||
                    pathname.startsWith("/api/blogs") ||
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