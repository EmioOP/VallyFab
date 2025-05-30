import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";

const inter = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Vally - Fabrics & Fashion  ",
  description: "Premium fashion and fabrics for your unique style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        /> */}
        <Analytics />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

import "./globals.css";
