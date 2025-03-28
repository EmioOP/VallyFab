"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { IProduct } from "@/model/productModel";
import Link from "next/link";

export default function ProductPageAdmin() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Product not found");
      }

      router.push("/admin/products");
    } catch (error: any) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center mt-16">
        <div className="animate-pulse text-xl">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center mt-16">
        <div className="text-red-500 text-xl">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex flex-col gap-4">
          <div className="border rounded-lg overflow-hidden h-[400px] relative">
            {product.images.length > 0 ? (
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="absolute inset-0 object-cover blur-md scale-110"
                  aria-hidden="true"
                />
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="relative object-contain z-10"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                No image available
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.images.map((src, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden h-24 relative cursor-pointer hover:border-blue-500"
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100px, 100px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Vally ID: {product.vallyId}
            </p>
          </div>

          <div className="text-2xl font-bold">₹{product.price}</div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Category</h3>
              <p className="text-gray-600 capitalize">{product.category.name}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Subcategory</h3>
              <p className="text-gray-600 capitalize">
                {product.subCategory.name || 'N/A'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Brand</h3>
              <p className="text-gray-600 capitalize">{product.brand}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Stock</h3>
              <p className="text-gray-600">{product.stock}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Available Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">
              {product.description || "No description available"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href={`/admin/update-product/${product._id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2"
            >
              Update
            </Link>
            <button
              className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 py-3 px-6 rounded-md flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}