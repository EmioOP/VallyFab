"use client";

import { useForm } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient, ProductFormData } from "@/lib/api-client";
import { useState, useEffect } from "react";
import { ICategory } from "@/model/categoryModel";
import { ISubCategory } from "@/model/subCategoryModel";
import { COLOR_OPTIONS } from "@/lib/constants";

function FormInput({
  label,
  error,
  children,
  id,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="form-control w-full ">
      <label htmlFor={id} className="label">
        <span className="label-text font-medium" aria-required={!!error}>
          {label}
        </span>
      </label>
      {children}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
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

  useEffect(() => {
    setValue("variants", variants);
  }, [variants, setValue]);

  const addColorVariant = () => {
    const colorName = COLOR_OPTIONS.find(
      (c) => c.toLowerCase() === currentColor.trim().toLowerCase()
    );

    if (!colorName) {
      showNotification("Invalid color name", "error");
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
          const response = await fetch(
            `/api/subcategories?categoryId=${categoryId}`
          );
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
    if (variants.length === 0) {
      showNotification("Please add at least one color variant", "error");
      return;
    }

    for (const variant of variants) {
      if (variant.images.length !== 4) {
        showNotification(`Each color variant needs exactly 4 images (${variant.color} has ${variant.images.length})`, "error");
        return;
      }
    }

    if (data.sizes.length === 0) {
      showNotification("Please select at least one size", "error");
      return;
    }

    if (!data.image) {
      showNotification("Main product image is required", "error");
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
      showNotification("Product created successfully!", "success");
      reset();
      setVariants([]);
      setSelectedSizes(["M"]);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create product",
        "error"
      );
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg dark:bg-base-300 dark:text-base-content">
      <h1 className="text-xl font-bold mb-8 text-center">Add New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Vally ID"
            error={errors.vallyId?.message}
            id="vallyId"
          >
            <input
              id="vallyId"
              type="text"
              className={`input input-bordered w-full ${errors.vallyId ? "input-error" : ""}`}
              placeholder="Enter Vally ID"
              {...register("vallyId", {
                required: "Vally ID is required",
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
          </FormInput>

          <FormInput
            label="Product Name"
            error={errors.name?.message}
            id="name"
          >
            <input
              id="name"
              type="text"
              className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
              placeholder="Enter product name"
              {...register("name", {
                required: "Name is required",
                maxLength: { value: 100, message: "Maximum 100 characters" },
              })}
            />
          </FormInput>

          <FormInput label="Price ($)" error={errors.price?.message} id="price">
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              max="10000"
              className={`input input-bordered w-full ${errors.price ? "input-error" : ""}`}
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
            label="Category"
            error={errors.category?.message}
            id="category"
          >
            <select
              id="category"
              className={`select select-bordered w-full ${errors.category ? "select-error" : ""}`}
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
          >
            <select
              id="subCategory"
              className={`select select-bordered w-full ${errors.subCategory ? "select-error" : ""}`}
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

          <FormInput label="Brand" error={errors.brand?.message} id="brand">
            <input
              id="brand"
              type="text"
              className={`input input-bordered w-full ${errors.brand ? "input-error" : ""}`}
              placeholder="Enter brand name"
              autoComplete="organization"
              {...register("brand", {
                required: "Brand is required",
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
          </FormInput>

          <FormInput label="Stock" error={errors.stock?.message} id="stock">
            <input
              id="stock"
              type="number"
              min="0"
              className={`input input-bordered w-full ${errors.stock ? "input-error" : ""}`}
              placeholder="Enter stock quantity"
              {...register("stock", {
                required: "Stock is required",
                valueAsNumber: true,
                min: { value: 0, message: "Stock cannot be negative" },
              })}
            />
          </FormInput>

          <FormInput
            label="Material"
            error={errors.material?.message}
            id="material"
          >
            <input
              id="material"
              type="text"
              className={`input input-bordered w-full ${errors.material ? "input-error" : ""}`}
              placeholder="Enter material (e.g., Cotton)"
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
          >
            <input
              id="fabricSize"
              type="text"
              className={`input input-bordered w-full ${errors.fabricSize ? "input-error" : ""}`}
              placeholder="Enter fabric dimensions (e.g., 150cm x 200cm)"
              {...register("fabricSize", {
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
          </FormInput>

          <FormInput
            label="Type Of Product"
            error={errors.typeOfProduct?.message}
            id="typeOfProduct"
          >
            <input
              id="typeOfProduct"
              type="text"
              className={`input input-bordered w-full ${errors.typeOfProduct ? "input-error" : ""}`}
              placeholder="Enter The Type of Product"
              {...register("typeOfProduct", {
                required: "Product type is required",
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
          </FormInput>

          <FormInput
            label="Available Sizes"
            error={errors.sizes?.message}
            id="sizes"
          >
            <div className="flex flex-wrap gap-4">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={size}
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="checkbox checkbox-primary"
                  />
                  <span className="font-medium">{size}</span>
                </label>
              ))}
            </div>
          </FormInput>

          <FormInput
            label="Color Variants"
            error={errors.variants?.message}
            id="variants"
          >
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  list="colors-list"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addColorVariant()}
                  placeholder="Select or type a color"
                  className="input input-bordered w-full border"
                />
                <button
                  type="button"
                  onClick={addColorVariant}
                  className="btn bg-secondary rounded border"
                >
                  Add Variant
                </button>
              </div>

              <datalist id="colors-list">
                {COLOR_OPTIONS.map((color) => (
                  <option key={color} value={color} />
                ))}
              </datalist>

              {variants.map((variant) => (
                <div key={variant.color} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: variant.color }}
                      />
                      <span className="font-medium">{variant.color}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.color)}
                      className="btn btn-xs btn-error"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <FileUpload 
                        onSuccess={(res) => handleUploadSuccess(res, variant.color)}
                        disabled={variant.images.length >= 4}
                      />
                      <span className="text-sm text-gray-500">
                        {4 - variant.images.length} images remaining
                      </span>
                    </div>

                    <div className="col-span-2 flex flex-wrap gap-2">
                      {variant.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${baseUrl}/${img.split("/").pop()}`}
                            alt={`${variant.color} variant ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(variant.color, index)}
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
          </FormInput>

          <FormInput
            label="Main Product Image"
            error={errors.image?.message}
            id="image"
          >
            <FileUpload 
              onSuccess={(res) => setValue("image", res.filePath)}
            />
            {watch("image") && (
              <img
                src={`${baseUrl}/${watch("image").split("/").pop()}`}
                alt="Main product preview"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}
          </FormInput>
        </div>

        <FormInput
          label="Description"
          error={errors.description?.message}
          id="description"
        >
          <textarea
            id="description"
            className={`textarea textarea-bordered w-full h-32 ${errors.description ? "textarea-error" : ""}`}
            placeholder="Enter product description"
            {...register("description", {
              required: "Description is required",
              maxLength: { value: 500, message: "Maximum 500 characters" },
            })}
          />
        </FormInput>

        <button
          type="submit"
          className="btn bg-secondary p-2 rounded w-full mt-8"
          disabled={isSubmitting}
          aria-label={isSubmitting ? "Creating product" : "Create product"}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Product...
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </form>
    </div>
  );
}