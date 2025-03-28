import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock blog data - same as in blog/page.tsx
const blogPosts = [
  {
    id: "1",
    title: "The Art of Fabric Selection for Summer Wear",
    excerpt:
      "Discover the best breathable fabrics for the summer season and how to style them for maximum comfort and elegance.",
    date: "May 15, 2025",
    image: "/placeholder.svg?height=600&width=800",
    category: "Fabrics",
    slug: "art-of-fabric-selection",
    author: {
      name: "Sophia Chen",
      image: "/placeholder.svg?height=100&width=100",
    },
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Sustainable Fashion: The Future of Luxury",
    excerpt:
      "How sustainable practices are reshaping the luxury fashion industry and why ethical choices matter for both consumers and brands.",
    date: "May 10, 2025",
    image: "/placeholder.svg?height=600&width=800",
    category: "Fashion",
    slug: "sustainable-fashion-luxury",
    author: {
      name: "James Wilson",
      image: "/placeholder.svg?height=100&width=100",
    },
    readTime: "7 min read",
  },
  {
    id: "3",
    title: "Styling Guide: Evening Wear for Special Occasions",
    excerpt: "Expert tips on selecting and styling the perfect evening wear for galas, weddings, and formal events.",
    date: "May 5, 2025",
    image: "/placeholder.svg?height=600&width=800",
    category: "Style Guide",
    slug: "evening-wear-styling-guide",
    author: {
      name: "Emma Rodriguez",
      image: "/placeholder.svg?height=100&width=100",
    },
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "Home Decor Trends: Incorporating Textiles in Your Space",
    excerpt:
      "Learn how to use fabrics and textiles to transform your living spaces and create a cozy, stylish home environment.",
    date: "April 28, 2025",
    image: "/placeholder.svg?height=600&width=800",
    category: "Home Decor",
    slug: "home-decor-textiles-trends",
    author: {
      name: "Michael Chang",
      image: "/placeholder.svg?height=100&width=100",
    },
    readTime: "8 min read",
  },
  {
    id: "5",
    title: "The History of Silk: From Ancient China to Modern Runways",
    excerpt: "Exploring the rich history of silk fabric and its enduring influence on fashion through the centuries.",
    date: "April 20, 2025",
    image: "/placeholder.svg?height=600&width=800",
    category: "Fabrics",
    slug: "history-of-silk",
    author: {
      name: "Olivia Martinez",
      image: "/placeholder.svg?height=100&width=100",
    },
    readTime: "10 min read",
  },
  {
    id: "6",
    title: "DIY Fabric Projects for Beginners",
    excerpt:
      "Simple and creative fabric projects that anyone can make at home, perfect for personalizing your wardrobe and home.",
    date: "April 15, 2025",
    image: "/placeholder.svg?height=600&width=800",
    category: "DIY",
    slug: "diy-fabric-projects-beginners",
    author: {
      name: "David Johnson",
      image: "/placeholder.svg?height=100&width=100",
    },
    readTime: "5 min read",
  },
]

// Categories for filter
const categories = ["All", "Fashion", "Fabrics", "Style Guide", "Home Decor", "DIY"]

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = params.category
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Filter posts by category
  const filteredPosts = blogPosts.filter((post) => post.category.toLowerCase() === categoryName.toLowerCase())

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">{categoryName}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our latest articles about {categoryName.toLowerCase()}
        </p>
      </div>

      {/* Categories */}
      <div className="flex justify-center mb-12 overflow-x-auto">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={category === "All" ? "/blog" : `/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                category === categoryName ? "bg-rosegold text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </Link>
              <div className="p-6 space-y-4">
                <div className="flex items-center text-xs text-gray-500">
                  <Link
                    href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-rosegold hover:underline"
                  >
                    {post.category}
                  </Link>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-primary">
                  <Link href={`/blog/${post.slug}`} className="hover:text-rosegold">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center pt-2">
                  <Image
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                  />
                  <span className="text-xs text-gray-500">By {post.author.name}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No articles found in this category.</p>
          <Link href="/blog">
            <Button className="bg-rosegold hover:bg-rosegold/90">View All Articles</Button>
          </Link>
        </div>
      )}

      {/* Pagination - only show if there are posts */}
      {filteredPosts.length > 0 && (
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <Button variant="outline" className="rounded-md" disabled>
              Previous
            </Button>
            <Button variant="outline" className="rounded-md bg-rosegold text-white">
              1
            </Button>
            <Button variant="outline" className="rounded-md">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

