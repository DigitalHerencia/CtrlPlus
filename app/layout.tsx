import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CTRL+ | Vehicle Wrap Management Platform",
  description:
    "Multi-tenant platform for vehicle wrap businesses to manage catalogs, enable customer visualization, handle bookings, and process payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
            <SiteHeader />

            <main className="flex-1">{children}</main>

            <SiteFooter />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
