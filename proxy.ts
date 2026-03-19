import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  const hostWithoutPort = host.split(":")[0];
  const parts = hostWithoutPort.split(".");

  let subdomain = "";

  if (hostWithoutPort.endsWith(".localhost") && parts.length > 1) {
    subdomain = parts[0];
  } else if (parts.length > 2) {
    subdomain = parts[0];
  }

  const reserved = new Set([
    "",
    "www",
    "app",
    "client",
    "deploylocal",
    "deploylocal-app",
  ]);

  if (!reserved.has(subdomain)) {
    url.pathname = `/sites/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
