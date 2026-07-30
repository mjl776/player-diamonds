"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  getExpectedSessionToken,
  isValidPassword,
} from "@/lib/auth";
import { LoginState } from "@/types/loginTypes";

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");

  if (!isValidPassword(password)) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, getExpectedSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });

  redirect(from.startsWith("/") ? from : "/");
}
