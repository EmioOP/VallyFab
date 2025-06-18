"use client";
import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import { IProduct } from "@/model/productModel";

// In-memory cache with timestamp
const cache = {
  data: null as IProduct[] | null,
  timestamp: 0,
  ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const now = Date.now();
      
      // Check if we have valid cached data
      if (cache.data && (now - cache.timestamp) < cache.ttl) {
        setProducts(cache.data);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/products/featured`, {
          cache: "force-cache",
          next: { 
            revalidate: 300 // Next.js ISR - revalidate every 5 minutes
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update cache
        cache.data = data;
        cache.timestamp = now;
        
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        // Fallback to cached data if available, even if expired
        if (cache.data) {
          setProducts(cache.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading && products.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-primary">Featured Products</h2>
            <p className="mt-2 text-gray-600">
              Discover our handpicked selection of premium items
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Loading skeleton */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary">Featured Products</h2>
          <p className="mt-2 text-gray-600">
            Discover our handpicked selection of premium items
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product._id?.toString()}
              _id={product._id}
              name={product.name}
              price={product.price}
              image={`${product.image}?tr=w-400,h-600,q-80`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}