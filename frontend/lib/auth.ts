import { createHash, createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "pd_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return secret;
}

export function getExpectedSessionToken(): string {
  return createHmac("sha256", getSessionSecret())
    .update("pd-authenticated")
    .digest("hex");
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = getExpectedSessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isValidPassword(candidate: string): boolean {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) {
    throw new Error("SITE_PASSWORD environment variable is not set");
  }
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(expected).digest();
  return a.length === b.length && timingSafeEqual(a, b);
}
