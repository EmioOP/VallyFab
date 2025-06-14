"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useCart } from "./cart-provider";
import { Button } from "./ui/button";
import { ShoppingBag, Menu, X, Search, User, ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ICategory } from "@/model/categoryModel";

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isShopSubmenuOpen, setIsShopSubmenuOpen] = useState(false);
  const [isDesktopShopOpen, setIsDesktopShopOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopShopRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-mobile-trigger]")
      ) {
        setMobileMenuOpen(false);
      }

      if (
        desktopShopRef.current &&
        !desktopShopRef.current.contains(event.target as Node)
      ) {
         setIsDesktopShopOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Logo - Updated with Image component */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="relative flex items-center">
              {/* Mobile logo size */}
              <div className="relative h-14 w-44 md:h-14 md:w-40">
                <Image
                  src="/logo.png"
                  alt="Vally Fabrics Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-primary hover:text-secondary font-medium"
            >
              Home
            </Link>

            <div className="relative" ref={desktopShopRef}>
              <button
                onClick={() => setIsDesktopShopOpen(!isDesktopShopOpen)}
                className="flex items-center text-primary hover:text-secondary font-medium"
              >
                Shop
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    isDesktopShopOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDesktopShopOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 p-1 shadow-lg z-50">
                  <Link
                    href="/shop/products"
                    className="block rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setIsDesktopShopOpen(false)}
                  >
                    All Products
                  </Link>
                  <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                  {categories.map((category) => (
                    <Link
                      key={category._id.toString()}
                      href={`/shop/products?category=${category._id}`}
                      className="block rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => setIsDesktopShopOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blogs"
              className="text-primary hover:text-secondary font-medium"
            >
              Blogs
            </Link>
            <Link
              href="/contact"
              className="text-primary hover:text-secondary font-medium"
            >
              Contact Us
            </Link>
            {/* <Link href="/about" className="text-primary hover:text-secondary font-medium">
              About
            </Link> */}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {pathname.startsWith("/shop") ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="disableBtn" size="icon" aria-label="Search">
                <Search className="h-5 w-5 hidden " />
              </Button>
            )}

            {/* User */}

            <div className="relative" ref={userMenuRef}>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </button>

              {userMenuOpen && status === "authenticated" && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 p-1 shadow-lg">
                  <Link
                    href="/account"
                    className="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span className="min-w-0">
                        Profile:{" "}
                        <span className="">{session?.user?.email}</span>
                      </span>
                    </div>
                  </Link>
                  <Link
                    href="/orders"
                    className="block rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Orders
                  </Link>

                  <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <button
                    className="w-full text-left rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={handleSignOut}
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* if user is not logged in */}
              {userMenuOpen && status === "unauthenticated" && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 p-1 shadow-lg">
                  <Link
                    href="/login"
                    className="block rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cart"
                className="relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rosegold text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-muted"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsShopSubmenuOpen(false);
                }}
              >
                Home
              </Link>

              {/* Shop with dropdown */}
              <div className="flex flex-col">
                <button
                  onClick={() => setIsShopSubmenuOpen(!isShopSubmenuOpen)}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-muted"
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isShopSubmenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isShopSubmenuOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/shop/products?category=${category._id}`}
                        className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-muted"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsShopSubmenuOpen(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Rest of the links */}
              <Link
                href="/blogs"
                className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-muted"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsShopSubmenuOpen(false);
                }}
              >
                Blogs
              </Link>
              <Link
                href="/contact"
                className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-muted"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsShopSubmenuOpen(false);
                }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}

        {/* Search bar */}
        {isSearchOpen && pathname.startsWith("/shop") && (
          <div className="border-t py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full rounded-md border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
