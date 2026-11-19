import { NextResponse } from "next/server";

// Jaga halaman yang butuh login sebelum dirender. Middleware hanya mengecek ADA/TIDAKNYA cookie
// sesi (cookie httpOnly dari backend); validasi token yang sebenarnya tetap dilakukan backend di
// setiap request /api/*. Jika cookie ada tapi sudah tidak valid, backend membalas 401 dan
// menghapus cookie tersebut.

const USER_COOKIE = "hpai_session";
const ADMIN_COOKIE = "hpai_admin_session";

const USER_PAGES = ["/profile", "/checkout", "/orders", "/order-confirmation"];

export function middleware(request) {
    const { pathname, search } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        if (pathname === "/admin/login") return NextResponse.next();
        if (!request.cookies.has(ADMIN_COOKIE)) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        return NextResponse.next();
    }

    if (USER_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`))) {
        if (!request.cookies.has(USER_COOKIE)) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("next", pathname + search);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/profile/:path*",
        "/checkout/:path*",
        "/orders/:path*",
        "/order-confirmation/:path*",
    ],
};
