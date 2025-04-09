import React, { Suspense } from "react";
import ProductsGrid from "@/components/ProductsGrid";

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold text-primary mb-8">All Products</h1>

      {/* Wrap the Client Component that uses useSearchParams in Suspense */}
      <Suspense fallback={<ProductsPageSkeleton />}>
        {/* Render the component that contains all the client logic */}
        {/* Pass server-side props here if needed in the future, like initial category */}
        <ProductsGrid />
      </Suspense>
    </div>
  );
}

function ProductsPageSkeleton() {
  const limit = 9; // Match the limit used in ProductGrid for skeleton count
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Skeleton for Desktop Filters */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24 space-y-6 animate-pulse">
          {/* Skeleton Search */}
          <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-1/2"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          {/* Skeleton Price */}
          <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-1/2"></div>
            <div className="flex gap-2 items-center">
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
          {/* Skeleton Categories */}
          <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-1/2"></div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
          {/* Skeleton Clear Button */}
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
        </div>
      </div>

      {/* Skeleton for Main Content */}
      <div className="flex-1">
        {/* Skeleton for Mobile Header (Optional, might be simple enough not to need) */}
        {/* <div className="flex justify-between items-center mb-6 md:hidden animate-pulse"> ... </div> */}

        {/* Skeleton for Desktop Sorting */}
        <div className="hidden md:flex justify-between items-center mb-6 animate-pulse">
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>

        {/* Skeleton for Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-pulse"
            >
              <div className="h-48 sm:h-56 md:h-64 bg-gray-300 dark:bg-gray-600"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
