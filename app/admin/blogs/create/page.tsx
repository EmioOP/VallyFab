'use client';
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const TinyMCE = dynamic(() => import("@tinymce/tinymce-react").then(mod => mod.Editor), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excert: string;
  author: string;
  category: string;
  image?: string;
}

export default function BlogEditor() {
  const router = useRouter();
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors, isSubmitting } 
  } = useForm<BlogFormData>({
    defaultValues: {
      author: "Vally",
      category: "Fashion",
      content: ""
    }
  });
  
  const editorRef = useRef<any>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSlugManual, setIsSlugManual] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && !isSlugManual) {
        const generatedSlug = value.title
          ?.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-') || '';
        setValue("slug", generatedSlug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, isSlugManual]);

  const handleImageSuccess = (response: IKUploadResponse) => {
    setValue("image", response.filePath);
    setImageUploading(false);
    setImageError(null);
  };

  const handleImageError = (error: { message: string }) => {
    setImageError(error.message);
    setImageUploading(false);
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error("Failed to create post");
      router.push("/blogs");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error creating post. Please check console for details.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Create New Blog Post
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              {...register("title", { 
                required: "Title is required",
                minLength: { value: 8, message: "Minimum 8 characters" }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.title 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-400"
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Slug Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug *
            </label>
            <input
              {...register("slug", { 
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: "Use lowercase letters, numbers, and hyphens"
                }
              })}
              onChange={() => setIsSlugManual(true)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.slug 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-400"
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>

          {/* Author Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Author *
            </label>
            <input
              {...register("author", { required: "Author is required" })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.author 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-400"
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.category 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-400"
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            >
              <option value="Fashion">Fashion</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>
        </div>

        {/* Excerpt Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Excerpt *
          </label>
          <textarea
            {...register("excert", { 
              required: "Excerpt is required",
              minLength: { value: 8, message: "Minimum 8 characters" }
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 h-32 ${
              errors.excert 
                ? "border-red-500 focus:ring-red-400" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
          />
          {errors.excert && <p className="text-red-500 text-sm mt-1">{errors.excert.message}</p>}
        </div>

        {/* Featured Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Featured Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 dark:border-gray-600">
            <IKUpload
              fileName="blog-image.jpg"
              onError={handleImageError}
              onSuccess={handleImageSuccess}
              onUploadStart={() => setImageUploading(true)}
              validateFile={(file) => {
                if (!file.type.includes("image/")) {
                  setImageError("Only image files are allowed");
                  return false;
                }
                if (file.size > 5 * 1024 * 1024) {
                  setImageError("File size must be less than 5MB");
                  return false;
                }
                return true;
              }}
              className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-600 dark:file:text-gray-100 dark:text-gray-300 dark:border-gray-600"
            />
            {imageUploading && (
              <div className="flex items-center gap-2 mt-4 text-blue-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading image...</span>
              </div>
            )}
            {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
            {watch("image") && (
              <div className="mt-4">
                <img 
                  src={watch("image")} 
                  alt="Preview" 
                  className="max-w-xs h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content *
          </label>
          <TinyMCE
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help | image | code',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              images_upload_handler: async (blobInfo, progress) => {
                try {
                  const file = blobInfo.blob();
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("fileName", `editor-${Date.now()}-${blobInfo.filename}`);
                  
                  const response = await fetch(process.env.NEXT_PUBLIC_IMAGEKIT_UPLOAD_URL!, {
                    method: "POST",
                    body: formData,
                    headers: {
                      "Authorization": `Basic ${btoa(process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY + ":")}`
                    }
                  });
                  
                  const result = await response.json();
                  return result.url;
                } catch (error) {
                  console.error("Image upload failed:", error);
                  throw new Error("Image upload failed");
                }
              }
            }}
            onEditorChange={(content) => setValue("content", content)}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">Content is required</p>}
        </div>

        <input type="hidden" {...register("content", { required: true })} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing...
            </div>
          ) : "Publish Post"}
        </button>
      </form>
    </div>
  );
}