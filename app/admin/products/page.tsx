"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IProduct } from "@/model/productModel";
import { useRouter } from "next/navigation";

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-3 mt-8 mb-8 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors"
      >
        ← Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white border-2 border-blue-600'
              : page === '...'
              ? 'cursor-default text-gray-400 bg-transparent'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors"
      >
        Next →
      </button>
    </div>
  );
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const itemsPerPage = 12; // Adjust as needed

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Add pagination parameters to your API call
        const response = await fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }
        
        const data = await response.json();
        
        // Backend returns: { products, total }
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Product not found");
      }

      // Refresh the current page after deletion
      const response = await fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
        
        // If current page is empty after deletion, go to previous page
        if (data.products?.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen max-h-full mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold mb-2 text-left ml-2">All Products</h1>
          <p className="text-sm text-gray-600 ml-2">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
          </p>
        </div>
        <Link href="/admin/products/create" className="btn btn-primary">
          Create New
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      ) : (
        <>
          <ul className="flex flex-wrap gap-4">
            {products?.map((product) => (
              <li
                key={product._id?.toString()}
                className="w-[calc(50%-8px)] sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4"
              >
                <div className="border p-4 rounded-lg shadow flex flex-col md:flex-row items-center">
                  {/* Image Section */}
                  <div className="w-full md:w-1/3 h-32 md:h-auto overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Product Details Section */}
                  <div className="w-full md:w-2/3 md:pl-4 mt-4 md:mt-0">
                    <h2 className="text-lg font-semibold truncate">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                      {product.description}
                    </p>
                    <p className="text-gray-800 mt-2 text-sm">
                      <strong>Price:</strong> ₹{product.price}
                    </p>
                    <p className="text-gray-800 mt-2 text-sm">
                      <strong>Category:</strong>{" "}
                      {product.category?.name || "unknown category"}
                    </p>
                    <p className="text-gray-800 mt-2 text-sm">
                      <strong>Size:</strong> {product.sizes}
                    </p>
                    <p className="text-gray-800 mt-2 text-sm">
                      <strong>Brand:</strong> {product.brand}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="btn btn-soft btn-primary"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/products/update/${product._id}`}
                        className="btn btn-soft btn-secondary"
                      >
                        Update
                      </Link>

                      <button
                        className="btn btn-soft btn-danger"
                        onClick={() => handleDelete(product._id?.toString() || '')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          

          {/* Show pagination when there are multiple pages */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}