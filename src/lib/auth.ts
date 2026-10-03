import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "sandbox_auth";

/** The password lives only in the SITE_PASSWORD environment variable, never in the repo. */
const secret = () => process.env.SITE_PASSWORD ?? "";

const mac = (key: string, msg: string) => createHmac("sha256", key).update(msg).digest();

/** What a logged-in cookie must contain. Changing the password invalidates every old cookie. */
export const sessionToken = () => mac(secret(), "sandbox-session-v1").toString("hex");

/** Fails closed: with no password configured, nobody gets in. */
export function passwordMatches(input: string): boolean {
  if (!secret()) return false;
  // Compare fixed-length digests so timing reveals nothing about the password.
  return timingSafeEqual(mac("cmp", input), mac("cmp", secret()));
}

export function cookieValid(value: string | undefined): boolean {
  if (!value || !secret()) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(sessionToken());
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Only allow redirects back into this site. */
export const safeNext = (next: unknown) =>
  typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : "/projects";
