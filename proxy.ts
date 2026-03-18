import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  const parts = host.split(".");
  const subdomain = parts.length > 2 ? parts[0] : "";

  if (
    subdomain &&
    subdomain !== "www" &&
    subdomain !== "app" &&
    subdomain !== "client"
  ) {
    url.pathname = `/sites/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
