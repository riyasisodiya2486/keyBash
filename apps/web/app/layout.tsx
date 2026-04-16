import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import RouteLoader from "@/components/ui/RouteLoader";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeyBash",
  description: "Competitive typing platform for practice, races, and performance tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <Suspense fallback={null}>
          <RouteLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
