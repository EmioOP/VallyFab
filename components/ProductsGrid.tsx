"use client";
import { useEffect, useState } from "react";
import { IProduct } from "@/model/productModel";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";
import debounce from "lodash.debounce";
import { useSearchParams } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}

export default function ProductsGrid() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    selectedCategories: [] as string[],
    selectedSizes: [] as string[],
    sort: "newest",
  });
  const limit = 9;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error(`Categories failed: ${response.status}`);
        const data = await response.json();
        setCategories(data.categories);

        if (categoryParam) {
          const foundCategory = data.categories.find((c: Category) =>
            c.name.toLowerCase() === categoryParam.toLowerCase()
          );
          if (foundCategory) {
            handleFilterChange("selectedCategories", [foundCategory._id]);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = debounce(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        categories: filters.selectedCategories.join(","),
        sizes: filters.selectedSizes.join(","),
        sort: filters.sort,
      });

      const response = await fetch(`/api/products?${params}`);
      const { products, total } = await response.json();
      
      setProducts(products);
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchProducts();
    return () => fetchProducts.cancel();
  }, [page, filters]);

  const handleFilterChange = (name: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const toggleCategory = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
  };

  const toggleSize = (size: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size]
    }));
  };

  const FilterContent = () => (
    <>
      <div>
        <h3 className="font-semibold text-lg mb-3">Price Range</h3>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            className="w-20"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
          <span>to</span>
          <Input
            type="number"
            placeholder="Max"
            className="w-20"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.selectedCategories.includes(category._id)}
                onChange={() => toggleCategory(category._id)}
                className="rounded border-gray-300"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setFilters({
            search: "",
            minPrice: "",
            maxPrice: "",
            selectedCategories: [],
            selectedSizes: [],
            sort: "featured"
          });
          setShowMobileFilters(false);
        }}
      >
        Clear Filters
      </Button>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold text-primary mb-8">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Search</h3>
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <FilterContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Input
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-32"
            />
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
              <div className="absolute left-0 top-0 h-full w-3/4 bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Search</h3>
                    <Input
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                  </div>
                  <FilterContent />
                </div>
              </div>
            </div>
          )}

          {/* Sorting */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `Showing ${products?.length} products`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                className="text-sm border rounded p-1"
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id?.toString()}
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    image={`${product.image}?tr=w-667,h-1000`}
                    category={product.category.name}
                    sizes={product.sizes}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-2xl font-bold mb-4">No products found</div>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}