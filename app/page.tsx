// app/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function LandingPage() {
  const categories = [
    {
      name: "Ladies Dresses",
      img: "https://img.freepik.com/free-photo/beautiful-woman-purple-sweater-skirt_1303-17493.jpg?t=st=1742139937~exp=1742143537~hmac=37a1e1733919cd0bc6efae8830399b17e0e21b6cfb7d62125c227f3d5adfaa3b&w=740",
      db_name: "women",
    },
    {
      name: "Kids Collection",
      img: "https://img.freepik.com/free-photo/wooden-hearts-children-s-hands_329181-7565.jpg?t=st=1742139446~exp=1742143046~hmac=f7bb395e7874b487b501388c378effe18a2572892b8d0a1657a9b5a6bbe43448&w=740",
      db_name: "kids",
    },
    {
      name: "Baby Bedding",
      img: "https://img.freepik.com/free-photo/sweet-red-haired-baby-lying-back-small-mattress_74855-6093.jpg?t=st=1742139560~exp=1742143160~hmac=eb4ca2f2f5b2703b12b67943fc6bd881b80aad23a58b3effa863eacf9a66868c&w=996",
      db_name: "accessories",
    },
    {
      name: "Home Textiles",
      img: "https://img.freepik.com/free-photo/home-decorations-interior-turquoise-blanket-wicker-basket-with-vase-flowers-candles_169016-2098.jpg?t=st=1742139732~exp=1742143332~hmac=38bcd340e055fa7d09649a933caa60eb4e217ca0e3396ff1169eaa85b3201d04&w=996",
      db_name: "home",
    },
  ];

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(()=>{
    if(session?.user.role === "admin"){
      router.push("/admin")
    }
  },[session])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center mb-4 md:mb-6">
            <div className="relative w-48 h-48 md:w-80 md:h-80 mb-4">
              <Image
                src="/vally-logo.png"
                alt="Vally Fabrics Logo"
                fill
                className="object-contain"
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
            className="bg-secondary lg:bg-accent  px-6 py-3 md:px-8 md:py-4 rounded-lg text-white hover:bg-secondary/90 transition-colors duration-300 text-base md:text-lg font-semibold "
          >
            Explore Collections
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="md:w-1/2 w-full">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/vally-shop.jpeg"
                alt="About Vally Fabrics"
                fill
                className="object-cover"
              />
            </div>
          </div>
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
                <strong className="text-secondary">
                  Our mission is clear:
                </strong>{" "}
                Your happiness is our top priority. We believe shopping should
                be a joyful experience.
              </p>
            </div>
            <p className="text-base md:text-lg text-primary/90 leading-relaxed">
              We're committed to offering premium products at exceptional
              prices, all backed by a team that genuinely cares about your
              needs.
            </p>
          </div>
        </div>
      </section>
      {/* Product Categories */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8 md:mb-12">
          Our Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/shop/products?category=${encodeURIComponent(
                category.db_name
              )}`}
              className="group relative block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-square">
                <Image
                  src={category.img}
                  alt={category.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
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
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="bg-rosegold/10 p-6 md:p-8 rounded-xl flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">
                Our Promise
              </h3>
              <ul className="space-y-2 md:space-y-4 text-sm md:text-base text-primary/90">
                <li>✓ Premium Quality Materials</li>
                <li>✓ Ethical Production Practices</li>
                <li>✓ 100% Customer Satisfaction</li>
                <li>✓ Fast & Reliable Delivery</li>
              </ul>
            </div>

            <div className="bg-santoriniblue/10 p-6 md:p-8 rounded-xl flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">
                Why Choose Us
              </h3>
              <ul className="space-y-2 md:space-y-4 text-sm md:text-base text-primary/90">
                <li>✓ Curated Fashion Collections</li>
                <li>✓ Affordable Luxury Pricing</li>
                <li>✓ Expert Style Advice</li>
                <li>✓ Easy Returns Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration CTA */}
      <section className="bg-accent/10 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-8">
            Work, Trade & Learn With Us!
          </h2>
          <p className="text-base md:text-lg text-primary/90 mb-6 md:mb-8 max-w-2xl mx-auto">
            Looking to showcase your skills and talents? Collaborate with us and
            turn your expertise into a rewarding experience.
          </p>
          <div className="space-y-4">
            <Link
              href="/contact"
              className="inline-block bg-secondary px-6 py-3 md:px-8 md:py-4 rounded-lg text-white hover:bg-secondary/90 transition-colors duration-300 text-base md:text-lg font-medium"
            >
              Discover Opportunities
            </Link>
            <p className="text-primary/80 text-sm md:text-base">
              Scroll down to contact us and learn more
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
