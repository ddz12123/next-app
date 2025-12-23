// app/api/set-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { TOKEN_KEY } from "@/utils/storage";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const res = NextResponse.json({ success: true });
  res.cookies.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
