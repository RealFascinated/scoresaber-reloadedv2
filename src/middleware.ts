import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log(request.cookies);
  const profileCookie = request.cookies.get("profile");

  if (request.nextUrl.pathname == "/") {
    // Has a claimed profile cookie
    if (profileCookie) {
      const id = profileCookie.value;
      return NextResponse.redirect(new URL(`/profile/${id}`, request.url));
    } else {
      // User has not claimed a profile
      return NextResponse.redirect(new URL("/search", request.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
