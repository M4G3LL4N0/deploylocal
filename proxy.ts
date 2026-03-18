import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  const isLocalhost = host.includes("localhost");
  let subdomain = "";

  if (isLocalhost) {
    const hostWithoutPort = host.split(":")[0];
    const parts = hostWithoutPort.split(".");
    if (parts.length > 1) {
      subdomain = parts[0];
    }
  } else {
    const parts = host.split(".");
    if (parts.length > 2) {
      subdomain = parts[0];
    }
  }

  if (
    subdomain &&
    subdomain !== "www" &&
    subdomain !== "app" &&
    subdomain !== "client"
  ) {
    url.pathname = `/sites/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
