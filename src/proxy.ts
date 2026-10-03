import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, cookieValid } from "@/lib/auth";

// Everything under these paths needs the sandbox password.
export const config = { matcher: ["/projects/:path*", "/writing/:path*", "/feed.xml"] };

// Plain image files stay fetchable: they belong to the locked pages but are not pages themselves,
// and Next's image optimizer has to load them without the visitor's cookie.
const IMAGE_FILE = /\.(avif|webp|png|jpe?g|gif|svg)$/i;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (IMAGE_FILE.test(pathname)) return NextResponse.next();
  if (cookieValid(request.cookies.get(COOKIE)?.value)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}
