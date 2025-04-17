"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { IBlog } from "@/model/blogModel"
import { Trash2, Edit } from "lucide-react"

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<IBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

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

  const calculateReadTime = (content) => {
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min read`
  }

  const handleDelete = async (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/blogs/${postId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Failed to delete post')
        
        setPosts(posts.filter(post => post._id !== postId))
      } catch (err) {
        setError(err.message)
      }
    }
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
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-primary">Manage Blog Posts</h1>
        <Link href="/admin/blogs/create">
          <Button className="bg-rosegold hover:bg-rosegold/90">
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post._id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <Image
                src={post.image.url}
                alt={post.title}
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Link href={`/admin/blogs/update/${post._id}`}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/90 hover:bg-white"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-600/90 hover:bg-red-600 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center text-xs text-gray-500">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-primary">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">{post.excert}</p>
              <div className="flex items-center pt-2">
                <span className="text-xs text-gray-500">By {post.author}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No blog posts found</p>
        </div>
      )}
    </div>
  )
}