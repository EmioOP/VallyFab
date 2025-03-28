import type React from "react"
import type { Metadata } from "next"
import { Urbanist } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import Providers from "@/components/Providers";


// const inter = Inter({ subsets: ["latin"] })
const inter = Urbanist({ subsets: ["latin"],weight:"400" })


export const metadata: Metadata = {
  title: "Vally - Fashion & Fabrics",
  description: "Premium fashion and fabrics for your unique style",
    
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'