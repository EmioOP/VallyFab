

import Link from "next/link";
import Image from "next/image";


export default function LandingPage() {
  const categories = [
    {
      name: "Ladies Dresses",
      img: "https://ik.imagekit.io/bufohim2jd/blog-image_iia1S0KhT.jpg",
      db_name: "women",
    },
    {
      name: "Kids Collection",
      img: "/kids.jpeg",
      db_name: "kids",
    },
    {
      name: "Accessories",
      img: "/accessories.jpeg",
      db_name: "accessories",
    },
    {
      name: "Home",
      img: "/home-decor.jpeg",
      db_name: "home",
    },
  ];

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
            className="bg-secondary lg:bg-secondary  px-6 py-3 md:px-8 md:py-4 rounded-lg text-white hover:bg-secondary/90 transition-colors duration-300 text-base md:text-lg font-semibold "
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
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
        <div className="container mx-auto px-4">
          <div className="text-justify max-w-4xl mx-auto">
            {" "}
            {/* Changed container */}
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-8 text-center">
              Work, Trade & Learn With Us!
            </h2>
            <p className="text-base md:text-lg text-primary/90 mb-6 md:mb-8">
              Looking to showcase your skills and talents? Collaborate with us
              and turn your expertise into a rewarding experience.
            </p>
            <div className="space-y-4 text-center">
              {" "}
              {/* Keep button centered */}
              <Link
                href="/contact"
                className="inline-block bg-secondary px-6 py-3 md:px-8 md:py-4 rounded-lg text-white hover:bg-secondary/90 transition-colors duration-300 text-base md:text-lg font-medium"
              >
                Discover Opportunities
              </Link>
            </div>
            {/* Subsequent sections */}
            <h2 className="text-2xl md:text-3xl font-bold text-primary mt-12 mb-6 md:mb-8">
              Partnership & Franchise Opportunities
            </h2>
            <p className="text-base md:text-lg text-primary/90 leading-relaxed">
              Join the Vally Fabrics and Fashion family and take your business
              to the next level. We're dedicated to helping entrepreneurs
              succeed by offering opportunities to set up franchises and retail
              our high-quality fabrics and exclusive fashion collections. With
              our proven business model and comprehensive marketing support,
              you'll have everything you need to build a successful venture. If
              you're looking for a rewarding partnership and a chance to grow
              with us, get in touch to learn more about joining our franchise
              network.
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mt-12 mb-6 md:mb-8">
            Wedding Consultants / Event Managers
            </h2>
            <p className="text-base md:text-lg text-primary/90 leading-relaxed">
              We understand the importance of elegance and perfection for your
              events. At Vally Fabrics and Fashion, we specialize in customized
              bridal wear tailored to perfection, stunning party dresses to make
              your events memorable, and bulk orders for themed events and
              special occasions. Let us handle your clothing needs while you
              focus on crafting unforgettable events. Reach out to discuss your
              requirements.
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mt-12 mb-6 md:mb-8">
              Students & Designers
            </h2>
            <p className="text-base md:text-lg text-primary/90 leading-relaxed">
              Are you a fashion or interior design student looking for a
              platform to grow your skills? We offer:
            </p>
            <ul className=" max-w-2xl mx-auto mb-6 md:mb-8 pl-0 ">
              <p className="flex items-start gap-3 text-base md:text-lg text-primary/90 ">
              <span>-</span>Access to our state-of-the-art designing and weaving studio
              </p>
              <p className="flex items-start gap-3 text-base md:text-lg text-primary/90">
              <span>-</span>Mentorship programs to enhance your professional journey
              </p>
              <p className="flex items-start gap-3 text-base md:text-lg text-primary/90">
              <span>-</span>Hands-on experience in retailing your creations through our sales centers
              </p>
            </ul>
            <p className="text-base md:text-lg text-primary/90 leading-relaxed">
              Take the next step in your design career with Valley Fabrics and
              Fashion. Contact us to get started!
            </p>
            {/* Other sections maintain the same structure */}
          </div>
        </div>
      </section>
    </div>
  );
}
