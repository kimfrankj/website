import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, cookieValid } from "@/lib/auth";

// Everything under these paths needs the sandbox password.
export const config = { matcher: ["/projects/:path*", "/writing/:path*", "/feed.xml"] };

export function proxy(request: NextRequest) {
  if (cookieValid(request.cookies.get(COOKIE)?.value)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`;
  return NextResponse.redirect(url);
}
