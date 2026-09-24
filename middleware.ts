import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const role = request.cookies.get("portal_role")?.value;
  const profile = request.cookies.get("portal_profile")?.value;

  if (role === "admin") {
    if (pathname.startsWith("/dashboard/admin") && profile !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  const redirectUrl = new URL("/login-admin", request.url);
  redirectUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
