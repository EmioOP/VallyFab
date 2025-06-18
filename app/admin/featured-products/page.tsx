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
  const [productsPerPage] = useState(12)
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
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: productsPerPage.toString(),
      })
      
      const queryToUse = searchTerm !== undefined ? searchTerm : ''
      if (queryToUse) {
        params.append('query', queryToUse)
      }
      
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
        await fetchFeaturedProducts()
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
    setCurrentPage(1)
    fetchAllProducts(searchQuery)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
    fetchAllProducts('')
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
        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
    )

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 cursor-default">
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
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition-colors duration-200 ${
            currentPage === i
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 font-semibold'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
          <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 cursor-default">
            ...
          </span>
        )
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
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
        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
      >
        Next
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )

    return pages
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6 py-8">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div className="h-10 bg-gray-300 rounded-lg w-80 animate-pulse"></div>
            <div className="h-10 bg-gray-300 rounded-lg w-32 animate-pulse"></div>
          </div>
          
          {/* Featured Products Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="h-6 bg-gray-300 rounded w-64 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-72 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* All Products Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="h-6 bg-gray-300 rounded w-48 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Featured Products</h1>
            <p className="text-gray-600">Manage your store's featured products showcase</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-8 p-4 rounded-xl border-l-4 shadow-sm animate-in slide-in-from-top-2 duration-300 ${
            message.includes('Error') 
              ? 'bg-red-50 border-red-400 text-red-800' 
              : 'bg-emerald-50 border-emerald-400 text-emerald-800'
          }`}>
            <div className="flex items-center">
              {message.includes('Error') ? (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {message}
            </div>
          </div>
        )}

        {/* Selected Featured Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Selected Featured Products</h2>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedProducts.length === 4 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedProducts.length}/4 Selected
              </div>
            </div>
          </div>
          
          {selectedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedProducts.map((productId, index) => {
                const product = allProducts.find(p => p._id === productId) || 
                              featuredProducts.find(p => p._id === productId)
                if (!product) return null
                
                return (
                  <div key={product._id} className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg">
                    {/* Position Badge */}
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleProductToggle(product._id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 transition-colors duration-200 shadow-lg group-hover:scale-110 transform"
                    >
                      ×
                    </button>
                    
                    <div className="relative h-36 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={product.image || '/placeholder-image.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{product.name}</h3>
                    <p className="text-emerald-600 font-bold text-lg">₹{product.price.toLocaleString()}</p>
                  </div>
                )
              })}
              
              {/* Empty Slots */}
              {Array.from({ length: 4 - selectedProducts.length }).map((_, index) => (
                <div key={`empty-${index}`} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 h-72 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-sm">Slot {selectedProducts.length + index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No featured products selected</p>
              <p className="text-gray-400 text-sm mt-2">Choose up to 4 products from the list below</p>
            </div>
          )}
        </div>

        {/* All Products Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">All Products</h2>
              <p className="text-gray-500 text-sm mt-1">
                Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
              </p>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search products by name or description..."
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Search
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-3 bg-gray-500 text-white font-medium rounded-xl hover:bg-gray-600 transition-colors duration-200"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(productsPerPage)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {allProducts.map((product) => {
                  const isSelected = selectedProducts.includes(product._id)
                  const canSelect = !isSelected && selectedProducts.length < 4
                  
                  return (
                    <div
                      key={product._id}
                      className={`group relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-300 bg-emerald-50 opacity-60' 
                          : canSelect
                          ? 'border-gray-200 hover:border-indigo-300 hover:shadow-lg transform hover:-translate-y-1'
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => canSelect && handleProductToggle(product._id)}
                    >
                      <div className="p-4">
                        <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.image || '/placeholder-image.jpg'}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-200 ${
                              canSelect ? 'group-hover:scale-105' : ''
                            }`}
                          />
                          {!canSelect && !isSelected && (
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center">
                              <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 font-medium">
                                4 products selected
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-indigo-600 font-bold text-lg">
                            ₹{product.price.toLocaleString()}
                          </p>
                          
                          {isSelected && (
                            <div className="flex items-center text-emerald-600 text-xs font-semibold">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Featured #{selectedProducts.indexOf(product._id) + 1}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {canSelect && (
                        <div className="absolute inset-0 bg-indigo-600 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="bg-white shadow-lg rounded-full p-2">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center space-y-4">
                  <nav className="flex rounded-xl shadow-sm overflow-hidden border border-gray-200" aria-label="Pagination">
                    {renderPagination()}
                  </nav>
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {allProducts.length === 0 && !loadingProducts && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">
                {searchQuery ? `No products match "${searchQuery}"` : 'No products available'}
              </p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear search and view all products
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}