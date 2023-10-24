import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookies = request.cookies;

  const playerIdCookie = cookies.get("playerId");
  if (pathname == "/") {
    if (playerIdCookie) {
      return NextResponse.redirect(
        new URL(`/player/${playerIdCookie.value}`, request.url),
      );
    } else {
      return NextResponse.redirect(new URL("/search", request.url));
    }
  }

  if (pathname == "/ranking/global") {
    return NextResponse.redirect(new URL("/ranking/global/1", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  return NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
