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
  title: "Recipes",
  description: "Tyler Merrick's Recipe Collection",
  openGraph: {
    title: "Recipes",
    description: "Tyler Merrick's Recipe Collection",
    url: "https://tylermerrick.com",
    siteName: "Recipes",
    images: [
  {
      url: "https://tylermerrick.com/og-image.png",
      width: 1200,
      height: 630,
      alt: "Recipes by Tyler Merrick",
    },
    {
      url: "https://tylermerrick.com/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Recipes by Tyler Merrick",
    }, 
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
