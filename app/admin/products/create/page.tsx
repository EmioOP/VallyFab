"use client";

import AdminProductForm from "@/components/AdminProductForm";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <a href="/admin" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            Admin Dashboard
          </a>
          <span className="text-slate-400 mx-2">/</span>
          <a href="/admin/products" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            Products
          </a>
          <span className="text-slate-400 mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">Create New Product</span>
        </Breadcrumb>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Create New Product
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Add a new product to your inventory with detailed information and variants
          </p>
        </div>

        {/* Main Content */}
        <Card className="max-w-6xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-slate-800 dark:text-slate-200">
              Product Information
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Fill in all required fields to create your product listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminProductForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}