"use client"

import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export default function Hero() {
  const router = useRouter()

  const handleShop = ()=>{
    router.push("/shop/products")
  }
  return (
    <section className="relative bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 md:py-24 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary">
              Elevate Your Style with Premium Fabrics
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              Discover our exclusive collection of high-quality fabrics and fashion pieces designed for the modern
              individual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={handleShop} size="lg" className="bg-rosegold hover:bg-rosegold/90">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="border-rosegold text-rosegold hover:bg-rosegold/10">
                Explore Collections
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-santoriniblue/20 to-rosegold/20" />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://img.freepik.com/free-vector/flat-design-fashion-designer-concept_23-2148821031.jpg?t=st=1742112713~exp=1742116313~hmac=6eac39d50f78d461d65c2ca7d44ffe175eaf42d5b1830b5e2755901455b13a20&w=740')" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

