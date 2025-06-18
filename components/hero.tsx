"use client"

import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'


export default function Hero() {
  const router = useRouter()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  const handleShop = () => {
    router.push("/shop/products")
  }

  const images = [
    'https://ik.imagekit.io/bufohim2jd/WhatsApp%20Image%202025-04-02%20at%2012.17.02%20PM.jpeg?updatedAt=1744206105751',
    'https://ik.imagekit.io/bufohim2jd/WhatsApp%20Image%202025-04-02%20at%2012.18.17%20PM.jpeg?updatedAt=1744206105184',
    'https://ik.imagekit.io/bufohim2jd/blog-image_iia1S0KhT.jpg',
    'https://ik.imagekit.io/bufohim2jd/WhatsApp%20Image%202025-04-02%20at%2012.33.17%20PM%20(3).jpeg?updatedAt=1744206114318'
  ]

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
              <Button onClick={handleShop} size="lg" className="bg-black hover:bg-black/90">
                Shop Now
              </Button>
              {/* <Button size="lg" variant="outline" className="border-rosegold text-rosegold hover:bg-rosegold/10">
                Explore Collections
              </Button> */}
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-santoriniblue/20 to-rosegold/20 z-10" />
            <div className="embla h-full" ref={emblaRef}>
              <div className="embla__container h-full">
                {images.map((image, index) => (
                  <div className="embla__slide relative h-full w-full" key={index}>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${image}')` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}