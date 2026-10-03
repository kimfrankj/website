import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, passwordMatches, safeNext, sessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const next = safeNext(form.get("next"));
  const ok = passwordMatches(String(form.get("password") ?? ""));

  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return NextResponse.redirect(new URL(`/unlock?error=1&next=${encodeURIComponent(next)}`, request.url), 303);
  }

  const res = NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
