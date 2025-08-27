import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Travel API",
    template: "%s | Travel API",
  },
  description: "Modern travel application built with Next.js",
  keywords: ["travel", "next.js", "typescript", "react"],
  authors: [{ name: "Travel API Team" }],
  creator: "Travel API",
  publisher: "Travel API",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://localhost:3000",
    title: "Travel API",
    description: "Modern travel application built with Next.js",
    siteName: "Travel API",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel API",
    description: "Modern travel application built with Next.js",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
