import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "DeployLocal",
  description:
    "DeployLocal helps businesses launch websites fast and gives admins a private lead engine to discover, score, and generate sites before outreach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <SiteHeader />

        {children}
      </body>
    </html>
  );
}
