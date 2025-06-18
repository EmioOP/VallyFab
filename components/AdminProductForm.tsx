"use client";

import { useForm } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, Plus, X, Image, Check, AlertCircle, Package, Palette, Camera } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient, ProductFormData } from "@/lib/api-client";
import { useState, useEffect } from "react";
import { ICategory } from "@/model/categoryModel";
import { ISubCategory } from "@/model/subCategoryModel";
import { COLOR_OPTIONS } from "@/lib/constants";

interface FormInputProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  id: string;
  required?: boolean;
  description?: string;
}

function FormInput({ label, error, children, id, required = false, description }: FormInputProps) {
  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{description}</p>
      )}
      {children}
      {error && (
        <label className="label">
          <span className="label-text-alt text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </span>
        </label>
      )}
    </div>
  );
}

function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-500">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminProductForm() {
  const { showNotification } = useNotification();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M"]);
  const [variants, setVariants] = useState<Array<{ color: string; images: string[] }>>([]);
  const [currentColor, setCurrentColor] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      vallyId: "",
      name: "",
      description: "",
      price: 0,
      category: "",
      subCategory: "",
      brand: "",
      sizes: ["M"],
      variants: [],
      image: "",
      stock: 0,
      material: "",
      fabricSize: "",
      typeOfProduct: ""
    },
  });

  // Calculate progress based on filled fields
  useEffect(() => {
    const watchedFields = watch();
    const totalFields = 11; // Main required fields
    let filledFields = 0;
    
    if (watchedFields.vallyId) filledFields++;
    if (watchedFields.name) filledFields++;
    if (watchedFields.price > 0) filledFields++;
    if (watchedFields.category) filledFields++;
    if (watchedFields.subCategory) filledFields++;
    if (watchedFields.brand) filledFields++;
    if (watchedFields.stock >= 0) filledFields++;
    if (watchedFields.material) filledFields++;
    if (watchedFields.typeOfProduct) filledFields++;
    if (watchedFields.description) filledFields++;
    if (variants.length > 0) filledFields++;
    
    setCurrentStep(Math.max(1, filledFields));
  }, [watch, variants]);

  useEffect(() => {
    setValue("variants", variants);
  }, [variants, setValue]);

  const addColorVariant = () => {
    const colorName = COLOR_OPTIONS.find(
      (c) => c.toLowerCase() === currentColor.trim().toLowerCase()
    );

    if (!colorName) {
      showNotification("Please select a valid color from the list", "error");
      return;
    }

    if (!variants.some(v => v.color === colorName)) {
      setVariants(prev => [...prev, { color: colorName, images: [] }]);
      setCurrentColor("");
      showNotification(`${colorName} variant added successfully!`, "success");
    } else {
      showNotification("This color variant already exists", "error");
    }
  };

  const removeVariant = (colorToRemove: string) => {
    setVariants(prev => prev.filter(v => v.color !== colorToRemove));
    showNotification(`${colorToRemove} variant removed`, "info");
  };

  const handleUploadSuccess = (response: IKUploadResponse, color: string) => {
    setVariants(prev => prev.map(v => {
      if (v.color === color) {
        if (v.images.length >= 4) {
          showNotification("Maximum 4 images per variant", "error");
          return v;
        }
        return { ...v, images: [...v.images, response.filePath] };
      }
      return v;
    }));
    showNotification("Image uploaded successfully!", "success");
  };

  const removeImage = (color: string, index: number) => {
    setVariants(prev => prev.map(v => {
      if (v.color === color) {
        return { ...v, images: v.images.filter((_, i) => i !== index) };
      }
      return v;
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        showNotification("Failed to load categories", "error");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [showNotification]);

  useEffect(() => {
    const categoryId = watch("category");
    if (categoryId) {
      const fetchSubCategories = async () => {
        try {
          setLoadingSubCategories(true);
          const response = await fetch(`/api/subcategories?categoryId=${categoryId}`);
          if (!response.ok) throw new Error("Failed to fetch subcategories");
          const data = await response.json();
          setSubCategories(data.subCategories);
          setValue("subCategory", "");
        } catch (error) {
          showNotification("Failed to load subcategories", "error");
          setSubCategories([]);
        } finally {
          setLoadingSubCategories(false);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [watch("category"), showNotification, setValue]);

  const handleSizeChange = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(newSizes);
    setValue("sizes", newSizes);
  };

  const onSubmit = async (data: ProductFormData) => {
    // Enhanced validation
    if (variants.length === 0) {
      showNotification("Please add at least one color variant with images", "error");
      return;
    }

    for (const variant of variants) {
      if (variant.images.length !== 4) {
        showNotification(`${variant.color} variant needs exactly 4 images (currently has ${variant.images.length})`, "error");
        return;
      }
    }

    if (data.sizes.length === 0) {
      showNotification("Please select at least one size option", "error");
      return;
    }

    if (!data.image) {
      showNotification("Main product image is required for the listing", "error");
      return;
    }

    try {
      await apiClient.createProduct({
        ...data,
        variants: variants.map(v => ({
          color: v.color,
          images: v.images.map(img => img.split("/").pop() || "")
        })),
        image: data.image.split("/").pop() || ""
      });
      
      showNotification("🎉 Product created successfully!", "success");
      
      // Reset form
      reset();
      setVariants([]);
      setSelectedSizes(["M"]);
      setCurrentStep(1);
      
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create product. Please try again.",
        "error"
      );
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

  return (
    <div className="max-w-6xl mx-auto">
      <ProgressIndicator currentStep={currentStep} totalSteps={11} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Basic Information
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormInput
              label="Vally ID"
              error={errors.vallyId?.message}
              id="vallyId"
              required
              description="Unique identifier for your product"
            >
              <input
                id="vallyId"
                type="text"
                className={`input input-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.vallyId ? "input-error" : "focus:border-blue-500"
                }`}
                placeholder="e.g., VLY-001"
                {...register("vallyId", {
                  required: "Vally ID is required",
                  maxLength: { value: 50, message: "Maximum 50 characters" },
                  pattern: {
                    value: /^[A-Za-z0-9-_]+$/,
                    message: "Only letters, numbers, hyphens, and underscores allowed"
                  }
                })}
              />
            </FormInput>

            <FormInput
              label="Product Name"
              error={errors.name?.message}
              id="name"
              required
            >
              <input
                id="name"
                type="text"
                className={`input input-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.name ? "input-error" : "focus:border-blue-500"
                }`}
                placeholder="Enter descriptive product name"
                {...register("name", {
                  required: "Product name is required",
                  maxLength: { value: 100, message: "Maximum 100 characters" },
                  minLength: { value: 3, message: "Minimum 3 characters" }
                })}
              />
            </FormInput>

            <FormInput 
              label="Price ($)" 
              error={errors.price?.message} 
              id="price"
              required
            >
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                max="10000"
                className={`input input-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.price ? "input-error" : "focus:border-blue-500"
                }`}
                placeholder="0.00"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0.01, message: "Price must be at least $0.01" },
                  max: { value: 10000, message: "Maximum price is $10,000" },
                })}
              />
            </FormInput>

            <FormInput
              label="Brand"
              error={errors.brand?.message}
              id="brand"
              required
            >
              <input
                id="brand"
                type="text"
                className={`input input-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.brand ? "input-error" : "focus:border-blue-500"
                }`}
                placeholder="Enter brand name"
                {...register("brand", {
                  required: "Brand is required",
                  maxLength: { value: 50, message: "Maximum 50 characters" },
                })}
              />
            </FormInput>

            <FormInput 
              label="Stock Quantity" 
              error={errors.stock?.message} 
              id="stock"
              required
            >
              <input
                id="stock"
                type="number"
                min="0"
                className={`input input-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.stock ? "input-error" : "focus:border-blue-500"
                }`}
                placeholder="Available quantity"
                {...register("stock", {
                  required: "Stock quantity is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Stock cannot be negative" },
                })}
              />
            </FormInput>

            <FormInput
              label="Type Of Product"
              error={errors.typeOfProduct?.message}
              id="typeOfProduct"
              required
            >
              <input
                id="typeOfProduct"
                type="text"
                className={`input input-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.typeOfProduct ? "input-error" : "focus:border-blue-500"
                }`}
                placeholder="e.g., T-Shirt, Dress, Jeans"
                {...register("typeOfProduct", {
                  required: "Product type is required",
                  maxLength: { value: 50, message: "Maximum 50 characters" },
                })}
              />
            </FormInput>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
            Categories & Classification
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Category"
              error={errors.category?.message}
              id="category"
              required
            >
              <select
                id="category"
                className={`select select-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.category ? "select-error" : "focus:border-blue-500"
                }`}
                disabled={loadingCategories || categories.length === 0}
                {...register("category", { required: "Category is required" })}
              >
                {loadingCategories ? (
                  <option disabled>Loading categories...</option>
                ) : categories.length === 0 ? (
                  <option disabled>No categories available</option>
                ) : (
                  <>
                    <option value="">Select a category</option>
                    {categories.map((category: ICategory) => (
                      <option
                        key={category._id.toString()}
                        value={category._id.toString()}
                      >
                        {category.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </FormInput>

            <FormInput
              label="Subcategory"
              error={errors.subCategory?.message}
              id="subCategory"
              required
            >
              <select
                id="subCategory"
                className={`select select-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.subCategory ? "select-error" : "focus:border-blue-500"
                }`}
                disabled={!watch("category") || loadingSubCategories || subCategories.length === 0}
                {...register("subCategory", { required: "Subcategory is required" })}
              >
                {!watch("category") ? (
                  <option disabled>Select a category first</option>
                ) : loadingSubCategories ? (
                  <option disabled>Loading subcategories...</option>
                ) : subCategories.length === 0 ? (
                  <option disabled>No subcategories available</option>
                ) : (
                  <>
                    <option value="">Select a subcategory</option>
                    {subCategories.map((subCategory) => (
                      <option
                        key={subCategory._id.toString()}
                        value={subCategory._id.toString()}
                      >
                        {subCategory.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </FormInput>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
            Product Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Material"
              error={errors.material?.message}
              id="material"
              required
            >
              <input
                id="material"
                type="text"
                className={`input input-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.material ? "input-error" : "focus:border-blue-500"
                }`}
                placeholder="e.g., 100% Cotton, Polyester Blend"
                {...register("material", {
                  required: "Material is required",
                  maxLength: { value: 100, message: "Maximum 100 characters" },
                })}
              />
            </FormInput>

            <FormInput
              label="Fabric Size"
              error={errors.fabricSize?.message}
              id="fabricSize"
              description="Optional - specify fabric dimensions"
            >
              <input
                id="fabricSize"
                type="text"
                className={`input input-bordered w-full bg-white dark:bg-slate-700 ${
                  errors.fabricSize ? "input-error" : "focus:border-blue-500"
                }`}
                placeholder="e.g., 150cm x 200cm"
                {...register("fabricSize", {
                  maxLength: { value: 50, message: "Maximum 50 characters" },
                })}
              />
            </FormInput>
          </div>

          <FormInput
            label="Description"
            error={errors.description?.message}
            id="description"
            required
            description="Detailed product description for customers"
          >
            <textarea
              id="description"
              rows={4}
              className={`textarea textarea-bordered w-full bg-white dark:bg-slate-700 ${
                errors.description ? "textarea-error" : "focus:border-blue-500"
              }`}
              placeholder="Describe the product features, benefits, and care instructions..."
              {...register("description", {
                required: "Description is required",
                maxLength: { value: 1000, message: "Maximum 1000 characters" },
                minLength: { value: 20, message: "Minimum 20 characters" }
              })}
            />
            <div className="text-right text-sm text-slate-500 mt-1">
              {watch("description")?.length || 0}/1000 characters
            </div>
          </FormInput>
        </div>

        {/* Sizes Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
            Available Sizes
          </h2>
          
          <FormInput
            label="Size Options"
            error={errors.sizes?.message}
            id="sizes"
            required
            description="Select all available sizes for this product"
          >
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
              {["XS", "S", "M", "L", "XL", "XXL", "FREE SIZE", "STANDARD", "NA"].map((size) => (
                <label
                  key={size}
                  className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700 ${
                    selectedSizes.includes(size)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={size}
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="sr-only"
                  />
                  <span className="font-medium text-sm">{size}</span>
                  {selectedSizes.includes(size) && (
                    <Check className="w-4 h-4 ml-1" />
                  )}
                </label>
              ))}
            </div>
          </FormInput>
        </div>

        {/* Color Variants Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Color Variants
            </h2>
          </div>
          
          <FormInput
            label="Add Color Variants"
            error={errors.variants?.message}
            id="variants"
            required
            description="Each color variant needs exactly 4 images"
          >
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    list="colors-list"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addColorVariant())}
                    placeholder="Select or type a color"
                    className="input input-bordered w-full bg-white dark:bg-slate-700 focus:border-purple-500"
                  />
                  <datalist id="colors-list">
                    {COLOR_OPTIONS.map((color) => (
                      <option key={color} value={color} />
                    ))}
                  </datalist>
                </div>
                <button
                  type="button"
                  onClick={addColorVariant}
                  className="btn bg-purple-600 hover:bg-purple-700 text-white border-0 px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </button>
              </div>

              {variants.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Palette className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No color variants added yet</p>
                  <p className="text-sm">Add your first color variant above</p>
                </div>
              )}

              <div className="grid gap-6">
                {variants.map((variant) => (
                  <div key={variant.color} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-500 shadow-sm"
                          style={{ backgroundColor: variant.color.toLowerCase() }}
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {variant.color}
                        </span>
                        <span className="text-sm text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded">
                          {variant.images.length}/4 images
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.color)}
                        className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FileUpload 
                          onSuccess={(res) => handleUploadSuccess(res, variant.color)}
                          disabled={variant.images.length >= 4}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {variant.images.length >= 4 ? "Maximum reached" : `${4 - variant.images.length} more needed`}
                        </span>
                      </div>

                      {variant.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {variant.images.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={`${baseUrl}/${img.split("/").pop()}`}
                                alt={`${variant.color} variant ${index + 1}`}
                                className="w-full h-20 object-cover rounded border border-slate-200 dark:border-slate-600"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(variant.color, index)}
                                className="absolute -top-2 -right-2 btn btn-circle btn-xs bg-red-500 hover:bg-red-600 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormInput>
        </div>

        {/* Main Product Image Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-6">
            <Camera className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Main Product Image
            </h2>
          </div>
          
          <FormInput
            label="Primary Display Image"
            error={errors.image?.message}
            id="image"
            required
            description="This image will be the main display image for your product"
          >
            <div className="space-y-4">
              <FileUpload 
                onSuccess={(res) => setValue("image", res.filePath)}
              />
              {watch("image") && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={`${baseUrl}/${watch("image").split("/").pop()}`}
                      alt="Main product preview"
                      className="w-48 h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Check className="w-3 h-3 inline mr-1" />
                      Main Image
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormInput>
        </div>

        {/* Submit Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Ready to Create Your Product?
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Review all information above and click the button below to add your product to the inventory.
            </p>
            
            <button
              type="submit"
              className="btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg font-medium min-w-48"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Product...
                </>
              ) : (
                <>
                  <Package className="w-5 h-5 mr-2" />
                  Create Product
                </>
              )}
            </button>
            
            {isSubmitting && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please wait while we process your product...
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}