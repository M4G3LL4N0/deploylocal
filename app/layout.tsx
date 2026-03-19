import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DeployLocal",
  description:
    "DeployLocal helps businesses launch websites fast and gives admins a private lead engine to discover, score, and generate sites before outreach.",
};

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-zinc-300 transition hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-semibold tracking-[0.3em] text-white"
              >
                DEPLOYLOCAL.APP
              </Link>

              <nav className="hidden items-center gap-6 md:flex">
                <NavLink href="/builder">Builder</NavLink>
                <NavLink href="/pricing">Pricing</NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
              >
                Login
              </Link>
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
