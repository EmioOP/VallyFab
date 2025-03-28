// app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function CategoryListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchCategories();
    }
  }, [status]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      setCategories(categories.filter((cat) => cat._id !== id));
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/admin/categories/create" className="btn btn-primary">
          Create New
        </Link>
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
      ) : categories.length === 0 ? (
        <div className="alert alert-info min-h-screen">
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
          <span>No categories found</span>
        </div>
      ) : (
        <div>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="border rounded-lg p-4 bg-base-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    href={`/admin/categories/${category._id}/products`}
                    className="btn btn-success btn-sm flex-1 min-w-[100px]"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/categories/update/${category._id}`}
                    className="btn btn-warning btn-sm flex-1 min-w-[100px]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="btn btn-error btn-sm flex-1 min-w-[100px]"
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
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="font-medium">{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      {new Date(category.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/categories/${category._id}/products`}
                          className="btn btn-success btn-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/categories/update/${category._id}`}
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(category._id)}
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