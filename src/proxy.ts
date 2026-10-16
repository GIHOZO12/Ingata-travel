import { NextResponse, type NextRequest } from "next/server";

// Runs before every /admin request. This is only a quick "optimistic" check
// (is there a login cookie at all?). The real verification happens on the
// server pages via verifyAdmin(), and the API itself rejects bad tokens.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Both are reachable without being logged in: login itself, and the
  // "set your password" link a new/reinvited account gets emailed.
  if (pathname === "/admin/login" || pathname === "/admin/set-password") {
    return NextResponse.next();
  }

  if (!request.cookies.has("admin_token")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
