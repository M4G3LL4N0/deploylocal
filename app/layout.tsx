import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DeployLocal.app",
  description:
    "AI-powered local business discovery, scoring, website generation, and outreach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
            <nav className="flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold tracking-[0.25em]">
                DEPLOYLOCAL.APP
              </Link>
              <Link href="/builder" className="text-sm hover:underline">
                Builder
              </Link>
              <Link href="/pricing" className="text-sm hover:underline">
                Pricing
              </Link>
            </nav>
            <nav>
              <Link
                href="/login"
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
              >
                Login
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
