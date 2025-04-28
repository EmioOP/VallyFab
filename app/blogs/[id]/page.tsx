"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  Clock,
  Calendar,
} from "lucide-react";
import { useEffect, useState, use } from "react";
import { useParams } from "next/navigation";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excert: string;
  content: string;
  author: string;
  image: string;
  category: string;
  createdAt: string;
}

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  console.log(params)

  const customProseStyles = `
  // .blog-post-prose ul {
  //   list-style: none;
  //   padding-left: 0;
  // }
  // .blog-post-prose ul li {
  //   position: relative;
  //   padding-left: 1.5rem;
  //   margin-bottom: 0.5rem;
  // }
  // .blog-post-prose ul li::before {
  //   content: "✓";
  //   color: #b76e79; /* Rosegold color */
  //   position: absolute;
  //   left: 0;
  // }
  
`;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params._id]);

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Post not found</h1>
        <Link href="/blog" className="text-rosegold hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-rosegold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-rosegold">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/blog/category/${post.category
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          className="hover:text-rosegold"
        >
          {post.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{post.title}</span>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Post Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{calculateReadTime(post.content)}</span>
            </div>
            <div className="text-rosegold">By {post.author}</div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.image.url}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Social Share */}
        <div className="hidden md:flex flex-col fixed left-8 top-1/2 -translate-y-1/2 space-y-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-rosegold hover:text-white transition-colors">
            <Facebook className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-rosegold hover:text-white transition-colors">
            <Twitter className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-rosegold hover:text-white transition-colors">
            <Linkedin className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-rosegold hover:text-white transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12 blog-post-prose">
          <style>{customProseStyles}</style>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Category */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Category</h3>
          <Link
            href={`/blog/category/${post.category
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-rosegold hover:text-white transition-colors"
          >
            {post.category}
          </Link>
        </div>

        {/* Back to Blog */}
        <div className="text-center mt-12">
          <Link href="/blogs" className="text-rosegold hover:underline">
            ← Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
