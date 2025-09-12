import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/auth/login", "/auth/register",'/forgot-password'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "SECRET_KEY");
    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"], // semua kecuali folder khusus
};
