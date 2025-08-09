import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "./providers";
import GlobalNavigation from "@/components/global-navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlobalRealEstate - Find Your Dream Property Worldwide",
  description: "Connect with trusted agents and discover premium properties across the globe with AI-powered matching and investment opportunities.",
  keywords: ["Real Estate", "Property", "Investment", "AI", "Global", "Luxury", "Home", "Apartment"],
  authors: [{ name: "GlobalRealEstate Team" }],
  openGraph: {
    title: "GlobalRealEstate",
    description: "Find your dream property worldwide with AI-powered matching",
    url: "https://globalrealestate.com",
    siteName: "GlobalRealEstate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalRealEstate",
    description: "Find your dream property worldwide",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AppProviders>
          <GlobalNavigation />
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
