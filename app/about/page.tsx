"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function page() {
    const router = useRouter()

    useEffect(()=>{
        router.push("/")
    },[])
  return (
    <section className="container mx-auto px-4 py-12 md:py-24">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">

        {/* <div className="md:w-1/2 w-full">
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/vally-shop.jpeg"
              alt="About Vally Fabrics"
              fill
              className="object-cover"
            />
          </div>
        </div> */}
        <div className="md:w-1/2 w-full space-y-4 md:space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            About Us
          </h2>
          <p className="text-base md:text-lg text-primary/90 leading-relaxed">
            Welcome to{" "}
            <strong className="text-secondary">
              Vally Fabrics and Fashion
            </strong>
            , where style, comfort, and quality come together. We offer a wide
            range of ladies' and kids' dresses, stylish accessories, cozy baby
            bedding, and beautiful home textiles like curtains, bedsheets,
            pillow covers, and cushions.
          </p>
          <div className="bg-accent/5 p-4 md:p-6 rounded-xl">
            <p className="text-base md:text-lg text-primary/90 leading-relaxed">
              <strong className="text-secondary">Our mission is clear:</strong>{" "}
              Your happiness is our top priority. We believe shopping should be
              a joyful experience.
            </p>
          </div>
          <p className="text-base md:text-lg text-primary/90 leading-relaxed">
            We're committed to offering premium products at exceptional prices,
            all backed by a team that genuinely cares about your needs.
          </p>
        </div>
      </div>
    </section>
  );
}
