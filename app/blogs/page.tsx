"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { IBlog } from "@/model/blogModel"

// Categories for filter
const categories = ["All", "Fashion", "Fabrics", "Style Guide", "Home Decor", "DIY"]

export default function BlogPage() {
  const [posts, setPosts] = useState<IBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blogs')
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        
        const formattedPosts = data.posts.map(post => ({
          ...post,
          date: new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          readTime: calculateReadTime(post.content)
        }))

        setPosts(formattedPosts)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const calculateReadTime = (content) => {
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min read`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">Our Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our latest articles on fashion trends, fabric care, style inspiration, and home decor
        </p>
      </div>

      {/* Featured Post */}
      {posts.length > 0 && (
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={posts[0].image.url}
                alt={posts[0].title}
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-rosegold text-white">
                Featured
              </Badge>
              <h2 className="text-2xl font-bold text-primary">
                <Link href={`/blogs/${posts[0]._id}`} className="hover:text-rosegold">
                  {posts[0].title}
                </Link>
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <span>{posts[0].date}</span>
                <span className="mx-2">•</span>
                <span>{posts[0].readTime}</span>
                <span className="mx-2">•</span>
                <Link
                  // href={`/blog/category/${posts[0].category.toLowerCase().replace(/\s+/g, "-")}`}
                  href={'/blogs'}
                  className="text-rosegold hover:underline"
                >
                  {posts[0].category}
                </Link>
              </div>
              <p className="text-gray-600">{posts[0].excert}</p>
              <div className="flex items-center">
                <span className="text-sm font-medium">By {posts[0].author}</span>
              </div>
              <div>
                <Link href={`/blogs/${posts[0]._id}`}>
                  <Button className="bg-rosegold hover:bg-rosegold/90">Read More</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex justify-center mb-12 overflow-x-auto">
        <div className="flex space-x-4">
          {/* {categories.map((category) => (
            <Link
              key={category}
              href={category === "All" ? "/blog" : `/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                category === "All" ? "bg-rosegold text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </Link>
          ))} */}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(1).map((post) => (
          <article
            key={post._id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/blogs/${post._id}`} className="block">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={post.image.url}
                  alt={post.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </Link>
            <div className="p-6 space-y-4">
              <div className="flex items-center text-xs text-gray-500">
                {/* <Link
                  href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-rosegold hover:underline"
                >
                  {post.category}
                </Link> */}
                <span className="mx-2">•</span>
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-primary">
                <Link href={`/blogs/${post._id}`} className="hover:text-rosegold">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">{post.excert}</p>
              <div className="flex items-center pt-2">
                <span className="text-xs text-gray-500">By {post.author}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <div className="flex space-x-2">
          <Button variant="outline" className="rounded-md" disabled>
            Previous
          </Button>
          <Button variant="outline" className="rounded-md bg-rosegold text-white">
            1
          </Button>
          <Button variant="outline" className="rounded-md">
            2
          </Button>
          <Button variant="outline" className="rounded-md">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}