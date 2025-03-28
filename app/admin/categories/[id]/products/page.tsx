// app/admin/categories/[id]/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
  category: string;
}

export default function CategoryProductsPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchProducts();
    }
  }, [status, id]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/categories/${id}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products);
      setCategoryName(data.category.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (status === "loading")
    return (
      <div className="text-center p-8">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (!session || session.user.role !== "admin") {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold truncate">
          Products in {categoryName || "Category"}
        </h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
          <Link href="/admin/products/create" className="btn btn-primary btn-sm md:btn-md">
            Create New Product
          </Link>
          <Link href="/admin/categories" className="btn btn-ghost btn-sm md:btn-md">
            Back to Categories
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex p-8 justify-center items-center overflow-hidden">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>No products found in this category</span>
        </div>
      ) : (
        <div>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 bg-base-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Price: ${product.price.toFixed(2)}</p>
                      <p>Stock: {product.stock}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    href={`/admin/products/update/${product._id}`}
                    className="btn btn-warning btn-sm flex-1 min-w-[80px]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-error btn-sm flex-1 min-w-[80px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="font-medium">{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/update/${product._id}`}
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="btn btn-error btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}