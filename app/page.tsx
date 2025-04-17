"use client";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function LandingPage() {
  const categories = [
    {
      name: "Ladies Dresses",
      img: "https://ik.imagekit.io/bufohim2jd/blog-image_iia1S0KhT.jpg",
      db_name: "women",
      alt: "Trendy women's dresses collection at Vally Fabrics",
    },
    {
      name: "Kids Collection",
      img: "/kids.jpeg",
      db_name: "kids",
      alt: "Adorable kids clothing collection for all occasions",
    },
    {
      name: "Accessories",
      img: "/accessories.jpeg",
      db_name: "accessories",
      alt: "Fashion accessories to complete your look",
    },
    {
      name: "Home",
      img: "/home-decor.jpeg",
      db_name: "home",
      alt: "Luxury home textiles and decor items",
    },
  ];

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.role === "admin") {
      router.push("/admin");
    }
  }, [session]);

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vally Fabrics and Fashion",
    "url": "https://vallyfab.com",
    "logo": "https://vallyfab.com/vally-logo.png",
    "description": "Premium fashion retailer offering stylish clothing, accessories, and home textiles",
    "sameAs": [
      "https://www.instagram.com/vallyfabricsfashion/"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Vally Fabrics & Fashion | Premium Clothing & Home Textiles Store</title>
        <meta 
          name="description" 
          content="Discover Vally Fabrics' curated collections of women's dresses, kids fashion, home decor & accessories. Quality fabrics, ethical production & affordable prices." 
        />
        <meta name="keywords" content="designer dresses, kids clothing, home textiles, fashion accessories, affordable fashion, quality fabrics" />
        <meta property="og:title" content="Vally Fabrics & Fashion | Premium Clothing & Home Textiles" />
        <meta property="og:description" content="Shop premium fashion collections with Vally Fabrics. Best prices on women's wear, kids clothing & home decor items." />
        <meta property="og:image" content="https://vallyfab.com/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      {/* Hero Section */}
      <header className="relative h-[500px] md:h-[600px] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center mb-4 md:mb-6">
            <div className="relative w-48 h-48 md:w-80 md:h-80 mb-4">
              <Image
                src="/vally-logo.png"
                alt="Vally Fabrics Logo - Premium Fashion Retailer"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-primary px-2">
              Vally Fabrics and{" "}
              <span className="lg:bg-secondary lg:text-white px-1 block md:inline mt-2 md:mt-0">
                Fashion
              </span>
            </h1>
          </div>
          <p className="text-lg md:text-2xl text-primary/90 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Where Style, Comfort and Quality Come Together
          </p>

          <Link
            href="/shop"
            className="bg-secondary lg:bg-secondary px-6 py-3 md:px-8 md:py-4 rounded-lg text-white hover:bg-secondary/90 transition-colors duration-300 text-base md:text-lg font-semibold"
            aria-label="Explore our fashion collections"
          >
            Explore Collections
          </Link>
        </div>
      </header>

      <main>
        {/* About Us Section */}
        <section className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="md:w-1/2 w-full">
              <figure className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/vally-shop.jpeg"
                  alt="Vally Fabrics store interior showcasing fashion collections"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </figure>
            </div>
            <div className="md:w-1/2 w-full space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                About Vally Fabrics and Fashion
              </h2>
              <p className="text-base md:text-lg text-primary/90 leading-relaxed">
                Welcome to <strong className="text-secondary">Vally Fabrics and Fashion</strong>, 
                your premier destination for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Trendsetting women's apparel</li>
                <li>Adorable kids' clothing collections</li>
                <li>Stylish fashion accessories</li>
                <li>Premium home textiles and decor</li>
              </ul>
              <div className="bg-accent/5 p-4 md:p-6 rounded-xl">
                <p className="text-base md:text-lg text-primary/90 leading-relaxed">
                  <strong className="text-secondary">Our Commitment:</strong>{" "}
                  Combining ethical manufacturing with affordable luxury, ensuring 
                  exceptional quality in every product.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="container mx-auto px-4 py-12 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8 md:mb-12">
            Explore Our Collections
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/shop/products?category=${encodeURIComponent(category.db_name)}`}
                className="group relative block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label={`Browse ${category.name}`}
              >
                <div className="relative aspect-square">
                  <Image
                    src={category.img}
                    alt={category.alt}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-2">
                  <h3 className="text-white text-lg md:text-xl font-semibold text-center">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Value Propositions */}
        <section className="bg-accent/5 py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">
              Why Choose Vally Fabrics
            </h2>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <article className="bg-rosegold/10 p-6 md:p-8 rounded-xl flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">
                  Our Quality Promise
                </h3>
                <ul className="space-y-2 md:space-y-4 text-sm md:text-base text-primary/90">
                  <li>✓ OEKO-TEX Certified Materials</li>
                  <li>✓ Ethical Production Methods</li>
                  <li>✓ 365-Day Return Policy</li>
                  <li>✓ Fast Worldwide Shipping</li>
                </ul>
              </article>

              <article className="bg-santoriniblue/10 p-6 md:p-8 rounded-xl flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">
                  Customer Benefits
                </h3>
                <ul className="space-y-2 md:space-y-4 text-sm md:text-base text-primary/90">
                  <li>✓ Price Match Guarantee</li>
                  <li>✓ Free Style Consultations</li>
                  <li>✓ VIP Loyalty Program</li>
                  <li>✓ Custom Tailoring Services</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* Collaboration Section */}
        <section className="bg-accent/10 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">
                Partnership Opportunities
              </h2>
              
              <section className="mb-12">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                  Franchise Program
                </h3>
                <p className="text-base md:text-lg text-primary/90 mb-4">
                  Expand your retail business with our proven franchise model offering:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Exclusive territory rights</li>
                  <li>Comprehensive staff training programs</li>
                  <li>Dedicated marketing support</li>
                </ul>
              </section>

              <section className="mb-12">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                  Wedding & Event Services
                </h3>
                <p className="text-base md:text-lg text-primary/90">
                  Our comprehensive bridal services include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Custom bridal wear design services</li>
                  <li>Bulk order discounts for events</li>
                  <li>Professional alteration and fitting services</li>
                </ul>
              </section>

              <section className="mb-12">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                  Student Programs
                </h3>
                <p className="text-base md:text-lg text-primary/90">
                  We support emerging talent through:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>State-of-the-art studio access</li>
                  <li>Industry expert mentorship programs</li>
                  <li>Retail experience opportunities</li>
                </ul>
              </section>

              <div className="text-center mt-8">
                <Link
                  href="/contact"
                  className="inline-block bg-secondary px-8 py-4 rounded-lg text-white hover:bg-secondary/90 transition-colors duration-300 text-lg font-medium"
                  aria-label="Contact us for collaboration opportunities"
                >
                  Connect With Us
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}