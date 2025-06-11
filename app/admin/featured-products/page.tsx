'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  image?: string
}

interface PaginationData {
  products: Product[]
  total: number
}

export default function AdminFeaturedProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [productsPerPage] = useState(12) // You can make this configurable
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    fetchAllProducts()
  }, [currentPage])

  const fetchFeaturedProducts = async () => {
    try {
      // Fetch currently featured products
      const featuredResponse = await fetch('/api/products/featured')
      const featuredData = await featuredResponse.json()
      
      setFeaturedProducts(featuredData)
      setSelectedProducts(featuredData.map((p: Product) => p._id))
    } catch (error) {
      console.error('Error fetching featured products:', error)
      setMessage('Error loading featured products')
    }
  }

  const fetchAllProducts = async (searchTerm?: string) => {
    try {
      setLoadingProducts(true)
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: productsPerPage.toString(),
      })
      
      // Use searchTerm parameter if provided, otherwise use empty string for no search
      const queryToUse = searchTerm !== undefined ? searchTerm : ''
      if (queryToUse) {
        params.append('query', queryToUse)
      }
      
      // Fetch paginated products
      const allProductsResponse = await fetch(`/api/products?${params}`)
      const allProductsData: PaginationData = await allProductsResponse.json()
      
      setAllProducts(allProductsData.products)
      setTotalProducts(allProductsData.total)
      
      if (currentPage === 1) {
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setMessage('Error loading products')
      setLoading(false)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else if (prev.length < 4) {
        return [...prev, productId]
      } else {
        setMessage('You can only select up to 4 featured products')
        setTimeout(() => setMessage(''), 3000)
        return prev
      }
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/products/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds: selectedProducts }),
      })

      if (response.ok) {
        setMessage('Featured products updated successfully!')
        await fetchFeaturedProducts() // Refresh featured products
      } else {
        setMessage('Error updating featured products')
      }
    } catch (error) {
      console.error('Error saving featured products:', error)
      setMessage('Error saving changes')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchAllProducts(searchQuery) // Pass the search query explicitly
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
    fetchAllProducts('') // Explicitly pass empty string to clear search
  }

  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
    )

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
            ...
          </span>
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border border-gray-300 ${
            currentPage === i
              ? 'bg-blue-50 text-blue-600 border-blue-500'
              : 'text-gray-500 bg-white hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
            ...
          </span>
        )
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
        >
          {totalPages}
        </button>
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    )

    return pages
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Featured Products</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Featured Products</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Selected Featured Products ({selectedProducts.length}/4)
        </h2>
        {selectedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {selectedProducts.map((productId, index) => {
              // Find product in either allProducts or featuredProducts
              const product = allProducts.find(p => p._id === productId) || 
                            featuredProducts.find(p => p._id === productId)
              if (!product) return null
              
              return (
                <div key={product._id} className="bg-white border-2 border-green-500 rounded-lg p-4 relative">
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <button
                    onClick={() => handleProductToggle(product._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                  <div className="relative h-32 mb-2">
                    <Image
                      src={product.image || '/placeholder-image.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-green-600 font-bold">₹{product.price}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No products selected for featuring</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Products</h2>
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setCurrentPage(1)
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </form>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(productsPerPage)].map((_, i) => (
                <div key={i} className="bg-gray-300 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {allProducts.map((product) => {
                const isSelected = selectedProducts.includes(product._id)
                return (
                  <div
                    key={product._id}
                    className={`bg-white rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-2 border-green-500 opacity-50' 
                        : 'border border-gray-200 hover:border-blue-500 hover:shadow-md'
                    }`}
                    onClick={() => !isSelected && handleProductToggle(product._id)}
                  >
                    <div className="relative h-32 mb-2">
                      <Image
                        src={product.image || '/placeholder-image.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-xs line-clamp-2 mb-1">{product.description}</p>
                    <p className="text-blue-600 font-bold">₹{product.price}</p>
                    {isSelected && (
                      <div className="mt-2 text-xs text-green-600 font-semibold">
                        ✓ Featured (Position {selectedProducts.indexOf(product._id) + 1})
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex" aria-label="Pagination">
                  {renderPagination()}
                </nav>
              </div>
            )}
          </>
        )}

        {allProducts.length === 0 && !loadingProducts && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}