"use client";
import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import { IProduct } from "@/model/productModel";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`/api/products/featured`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json()
      setProducts(data.products)
    };

    fetchProducts()
  }, []);


  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary">Featured Products</h2>
          <p className="mt-2 text-gray-600">
            Discover our handpicked selection of premium fashion items
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id?.toString()}
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    image ={`${product.image}?tr=w-667,h-1000`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}