import type { Metadata } from "next";
import { Geist, Geist_Mono, Luckiest_Guy, Fredoka } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Luckiest_Guy({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Fredoka({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DylGPT",
  description: "Chat with DylGPT - Messages are sent via SMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${body.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
