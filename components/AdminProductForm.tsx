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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
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
      images: [],
      stock: 0,
      material: "",
      fabricSize: "",
    },
  });

  useEffect(() => {
    setValue("colors", selectedColors);
  }, [selectedColors, setValue]);

  const addColor = () => {
    const colorName = COLOR_OPTIONS.find(
      (c) => c.toLowerCase() === currentColor.trim().toLowerCase()
    );

    if (!colorName) {
      showNotification("Invalid color name", "error");
      return;
    }

    if (!selectedColors.includes(colorName)) {
      setSelectedColors((prev) => [...prev, colorName]);
      setCurrentColor("");
    }
  };

  const removeColor = (colorToRemove: string) => {
    setSelectedColors((prev) => prev.filter((c) => c !== colorToRemove));
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

  const handleUploadSuccess = (response: IKUploadResponse) => {
    if (uploadedImages.length >= 4) {
      showNotification("Maximum 4 images allowed", "error");
      return;
    }
    const newImages = [...uploadedImages, response.filePath];
    setUploadedImages(newImages);
    setValue("images", newImages);
    showNotification("Image uploaded successfully!", "success");
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setValue("images", newImages);
  };

  const handleSizeChange = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(newSizes);
    setValue("sizes", newSizes);
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log(data)
    if (selectedColors.length === 0) {
      showNotification("Please select at least one color", "error");
      return;
    }

    if (data.sizes.length === 0) {
      showNotification("Please select at least one size", "error");
      return;
    }

    if (data.images.length !== 4) {
      showNotification("Exactly 4 images are required", "error");
      return;
    }

    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");
      reset();
      setSelectedSizes(["M"]);
      setUploadedImages([]);
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
          {/* Existing fields */}
          <FormInput
            label="Vally ID"
            error={errors.vallyId?.message}
            id="vallyId"
          >
            <input
              id="vallyId"
              type="text"
              className={`input input-bordered w-full border${
                errors.vallyId ? "input-error" : ""
              }`}
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
              className={`input input-bordered w-full border ${
                errors.name ? "input-error" : ""
              }`}
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
              className={`input input-bordered w-full border ${
                errors.price ? "input-error" : ""
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
            label="Category"
            error={errors.category?.message}
            id="category"
          >
            <select
              id="category"
              className={`select select-bordered w-full border ${
                errors.category ? "select-error" : ""
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
          >
            <select
              id="subCategory"
              className={`select select-bordered w-full border ${
                errors.subCategory ? "select-error" : ""
              }`}
              disabled={
                !watch("category") ||
                loadingSubCategories ||
                subCategories.length === 0
              }
              {...register("subCategory", {
                required: "Subcategory is required",
              })}
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
              className={`input input-bordered w-full border ${
                errors.brand ? "input-error" : ""
              }`}
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
              className={`input input-bordered w-full ${
                errors.stock ? "input-error" : ""
              }`}
              placeholder="Enter stock quantity"
              {...register("stock", {
                required: "Stock is required",
                valueAsNumber: true,
                min: { value: 0, message: "Stock cannot be negative" },
              })}
            />
          </FormInput>

          {/* New Material Field */}
          <FormInput
            label="Material"
            error={errors.material?.message}
            id="material"
          >
            <input
              id="material"
              type="text"
              className={`input input-bordered w-full border ${
                errors.material ? "input-error" : ""
              }`}
              placeholder="Enter material (e.g., Cotton)"
              {...register("material", {
                maxLength: { value: 100, message: "Maximum 100 characters" },
              })}
            />
          </FormInput>

          {/* New Fabric Size Field */}
          <FormInput
            label="Fabric Size"
            error={errors.fabricSize?.message}
            id="fabricSize"
          >
            <input
              id="fabricSize"
              type="text"
              className={`input input-bordered w-full border ${
                errors.fabricSize ? "input-error" : ""
              }`}
              placeholder="Enter fabric dimensions (e.g., 150cm x 200cm)"
              {...register("fabricSize", {
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
                    className="checkbox checkbox-primary "
                  />
                  <span className="font-medium">{size}</span>
                </label>
              ))}
            </div>
          </FormInput>

          <FormInput
            label="Available Colors"
            error={errors.colors?.message}
            id="colors"
          >
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  list="colors-list"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addColor()}
                  placeholder="Select or type a color"
                  className="input input-bordered w-full border"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="btn bg-secondary rounded border "
                >
                  Add Color
                </button>
              </div>

              <datalist id="colors-list">
                {COLOR_OPTIONS.map((color) => (
                  <option key={color} value={color} />
                ))}
              </datalist>

              <div className="flex flex-wrap gap-2">
                {selectedColors.map((color) => (
                  <div
                    key={color}
                    className="badge badge-outline gap-1 items-center pl-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </FormInput>
        </div>

        <FormInput
          label="Description"
          error={errors.description?.message}
          id="description"
        >
          <textarea
            id="description"
            className={`textarea textarea-bordered w-full h-32 border${
              errors.description ? "textarea-error" : ""
            }`}
            placeholder="Enter product description"
            {...register("description", {
              required: "Description is required",
              maxLength: { value: 500, message: "Maximum 500 characters" },
            })}
          />
        </FormInput>

        <FormInput
          label="Product Images (4 required)"
          error={errors.images?.message}
          id="images"
        >
          <div className="space-y-4">
            {uploadedImages.length < 4 && (
              <FileUpload onSuccess={handleUploadSuccess} />
            )}
            <div className="flex flex-wrap gap-4 mt-4">
              {uploadedImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={`${baseUrl}/${img.split("/").pop()}`}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="btn btn-circle btn-xs absolute -top-2 -right-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
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
