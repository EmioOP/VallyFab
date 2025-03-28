import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Vally</h3>
            <p className="text-sm text-gray-600 mb-4">
              Premium fashion and fabrics for your unique style. Quality
              materials, timeless designs.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-rosegold">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-rosegold">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-rosegold">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-rosegold"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/fabrics"
                  className="text-gray-600 hover:text-rosegold"
                >
                  Fabrics
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-gray-600 hover:text-rosegold"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="text-gray-600 hover:text-rosegold"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/sale"
                  className="text-gray-600 hover:text-rosegold"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-rosegold"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-rosegold"
                >
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join to our WhatsApp Community be the first to know about new
              collections, special offers, and exclusive events.
            </p>
            <form className="space-y-2">
              <input
                type="number"
                placeholder="Enter Your WhatsApp Number"
                className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <button
                type="submit"
                className="w-full rounded-md bg-rosegold px-3 py-2 text-sm font-medium text-white hover:bg-rosegold/90 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Vally. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
