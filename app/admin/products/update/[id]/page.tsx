"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { IProduct, ProductFormData } from "@/model/productModel";
import { ICategory } from "@/model/categoryModel";
import { ISubCategory } from "@/model/subCategoryModel";
import { COLOR_OPTIONS } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export default function EditProductForm() {
  const { id } = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [variants, setVariants] = useState<Array<{ color: string; images: string[] }>>([]);
  const [currentColor, setCurrentColor] = useState("");
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    vallyId: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    subCategory: "",
    brand: "",
    sizes: [],
    variants: [],
    image: "",
    stock: 0,
    material: "",
    fabricSize: "",
    typeOfProduct: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        setError("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      const fetchSubCategories = async () => {
        try {
          setLoadingSubCategories(true);
          const response = await fetch(
            `/api/subcategories?categoryId=${formData.category}`
          );
          const data = await response.json();
          setSubCategories(data.subCategories);
        } catch (error) {
          setError("Failed to load subcategories");
        } finally {
          setLoadingSubCategories(false);
        }
      };
      fetchSubCategories();
    }
  }, [formData.category]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch product");
        
        const product = data.product;
        setFormData({
          ...product,
          price: product.price,
          sizes: product.sizes,
          variants: product.variants
        });
        setSelectedSizes(product.sizes);
        setVariants(product.variants);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (variants.length === 0) {
      setError("Please add at least one color variant");
      return;
    }

    for (const variant of variants) {
      if (variant.images.length !== 4) {
        setError(`${variant.color} variant needs exactly 4 images`);
        return;
      }
    }

    try {
      setUpdating(true);
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          variants: variants.map(v => ({
            color: v.color,
            images: v.images.map(img => img.split("/").pop() || "")
          })),
          image: formData.image?.split("/").pop() || ""
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      setSuccess("Product updated successfully!");
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(newSizes);
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const addColorVariant = () => {
    const colorName = COLOR_OPTIONS.find(
      c => c.toLowerCase() === currentColor.trim().toLowerCase()
    );

    if (!colorName) {
      setError("Invalid color name");
      return;
    }

    if (!variants.some(v => v.color === colorName)) {
      setVariants(prev => [...prev, { color: colorName, images: [] }]);
      setCurrentColor("");
    }
  };

  const removeVariant = (colorToRemove: string) => {
    setVariants(prev => prev.filter(v => v.color !== colorToRemove));
  };

  const handleMainImageUpload = (response: IKUploadResponse) => {
    setFormData(prev => ({ ...prev, image: response.filePath }));
    setSuccess("Main image uploaded successfully!");
  };

  const handleVariantImageUpload = (response: IKUploadResponse, color: string) => {
    setVariants(prev => prev.map(v => {
      if (v.color === color) {
        return { ...v, images: [...v.images, response.filePath] };
      }
      return v;
    }));
    setSuccess("Variant image uploaded successfully!");
  };

  const removeVariantImage = (color: string, index: number) => {
    setVariants(prev => prev.map(v => {
      if (v.color === color) {
        return { ...v, images: v.images.filter((_, i) => i !== index) };
      }
      return v;
    }));
  };

  if (loading) return <div className="text-center py-4"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
      <h1 className="text-xl font-bold mb-8 text-center">Edit Product</h1>
      
      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vally ID */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Vally ID</span>
            </label>
            <input
              type="text"
              name="vallyId"
              value={formData.vallyId}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          {/* Product Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          {/* Price */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price ($)</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              className="input input-bordered"
              required
            />
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered"
              disabled={loadingCategories}
              required
            >
              {loadingCategories ? (
                <option>Loading categories...</option>
              ) : (
                <>
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Subcategory */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Subcategory</span>
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="select select-bordered"
              disabled={!formData.category || loadingSubCategories}
              required
            >
              {loadingSubCategories ? (
                <option>Loading subcategories...</option>
              ) : (
                <>
                  <option value="">Select Subcategory</option>
                  {subCategories.map(sub => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Brand */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Brand</span>
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          {/* Sizes */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Available Sizes</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL", "XXL"].map(size => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="checkbox checkbox-primary"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Stock Quantity</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          {/* Material */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Material</span>
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          {/* Fabric Size */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Fabric Size</span>
            </label>
            <input
              type="text"
              name="fabricSize"
              value={formData.fabricSize}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          {/* Product Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Type</span>
            </label>
            <input
              type="text"
              name="typeOfProduct"
              value={formData.typeOfProduct}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          {/* Main Image */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Main Product Image</span>
            </label>
            <FileUpload onSuccess={handleMainImageUpload} />
            {formData.image && (
              <img
                src={`${baseUrl}/${formData.image.split("/").pop()}`}
                alt="Main product"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}
          </div>

          {/* Color Variants */}
          <div className="form-control col-span-2">
            <label className="label">
              <span className="label-text">Color Variants</span>
            </label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  list="colors-list"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  placeholder="Select or type color"
                  className="input input-bordered flex-1"
                />
                <button
                  type="button"
                  onClick={addColorVariant}
                  className="btn btn-primary"
                >
                  Add Variant
                </button>
              </div>
              <datalist id="colors-list">
                {COLOR_OPTIONS.map(color => (
                  <option key={color} value={color} />
                ))}
              </datalist>

              {variants.map(variant => (
                <div key={variant.color} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: variant.color }}
                      />
                      <span className="font-medium">{variant.color}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.color)}
                      className="btn btn-error btn-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <FileUpload
                        onSuccess={(res) => handleVariantImageUpload(res, variant.color)}
                        disabled={variant.images.length >= 4}
                      />
                      <span className="text-sm">
                        {4 - variant.images.length} images remaining
                      </span>
                    </div>

                    <div className="col-span-2 flex flex-wrap gap-2">
                      {variant.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${baseUrl}/${img.split("/").pop()}`}
                            alt={`${variant.color} variant`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(variant.color, index)}
                            className="btn btn-circle btn-xs absolute -top-2 -right-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered h-32"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={updating}
        >
          {updating ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Updating Product...
            </>
          ) : (
            "Update Product"
          )}
        </button>
      </form>
    </div>
  );
}