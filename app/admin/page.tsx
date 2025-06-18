import React from "react";
import Link from "next/link";

export default function Admin() {
  const adminSections = [
    {
      title: "Products",
      description: "Manage your product catalog - create, update, delete, and view all products in the database. Control inventory, pricing, and product details.",
      href: "/admin/products",
      icon: "📦",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Blogs",
      description: "Manage your blog content - create engaging articles, update existing posts, delete outdated content, and organize your blog library.",
      href: "/admin/blogs", 
      icon: "📝",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Categories",
      description: "Organize your content with categories - create new categories, manage existing ones, and view all products associated with each category.",
      href: "/admin/categories",
      icon: "🏷️",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Contact",
      description: "Manage customer inquiries and messages - view contact submissions, respond to customer queries, and maintain communication records.",
      href: "/admin/contact",
      icon: "📧",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Promotions",
      description: "Create and manage promotional campaigns  - set up featured products, discounts, view active promotions, and analyze their performance.",
      href: "/admin/promotions",
      icon: "🎉",
      color: "bg-orange-500 hover:bg-orange-600"
    }

  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your website content and settings</p>
          </div>
        </div>
      </div>

      {/* Admin Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {adminSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{section.icon}</span>
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {section.description}
                </p>

                {/* Action Button */}
                <div className="flex justify-end">
                  <Link href={section.href}>
                    <button className={`btn ${section.color} text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:transform hover:scale-105`}>
                      Go to {section.title}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-lg font-semibold text-gray-900">---</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Published Blogs</p>
                  <p className="text-lg font-semibold text-gray-900">---</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📂</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Active Categories</p>
                  <p className="text-lg font-semibold text-gray-900">---</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">New Messages</p>
                  <p className="text-lg font-semibold text-gray-900">---</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="text-center text-gray-500 py-8">
                <span className="text-4xl mb-4 block">📊</span>
                <p>Activity feed will be displayed here</p>
                <p className="text-sm mt-2">Connect your database to see recent changes and updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}