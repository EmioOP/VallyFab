"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddToCartButton from "@/components/add-to-cart-button";
import { IProduct } from "@/model/productModel";
import { useNotification } from "@/components/Notification";

// Arrow Navigation Hook
function useArrowButton(emblaApi: any) {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const handlePrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return {
    canScrollPrev,
    canScrollNext,
    handlePrev,
    handleNext,
  };
}

// Dot Navigation Hook and Component
function useDotButton(emblaApi: any) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
}

function DotButton(props: any) {
  const { children, ...restProps } = props;
  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
}

interface Props {
  serverProduct: IProduct;
}

export default function ProductDetailPage({ serverProduct }: Props) {
  const params = useParams();
  const [product, setProduct] = useState<IProduct | null>(serverProduct);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [error, setError] = useState("");
  const { showNotification } = useNotification();

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  // Navigation hooks
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const { canScrollPrev, canScrollNext, handlePrev, handleNext } =
    useArrowButton(emblaApi);
  const currentVariantImages =
    product?.variants[selectedVariantIndex]?.images || [];

  const handleBuyNow = () => {
    if (!product) return;
    if (product.sizes[0] !== "NA" && !selectedSize) {
      showNotification("Please Select Size", "error");
      return;
    }

    const phoneNumber = process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER!;
    const message = `Hi, I want to buy the following product:
      
  *Product Name:* ${product.name}
  *Vally Id:* ${product.vallyId}
  *Price:* ₹${product.price}
  *Size:* ${selectedSize || "Not selected"}
  *Color:* ${product.variants[selectedVariantIndex].color}
  *Quantity:* ${quantity}
  
  Please confirm availability and proceed with the order.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  //share button
  const handleShare = async () => {
    try {
      const shareData = {
        title: product?.name,
        text: `Check out ${product?.name} - ₹${product?.price}`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop browsers
        await navigator.clipboard.writeText(window.location.href);
        showNotification("Product link copied to clipboard!", "success");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      showNotification("Sharing failed. Please try again.", "error");
    }
  };

  // Update thumbnails when variant changes
  useEffect(() => {
    if (emblaApi && emblaThumbsApi) {
      emblaApi.reInit();
      emblaThumbsApi.reInit();
      emblaApi.scrollTo(0);
    }
  }, [selectedVariantIndex, emblaApi, emblaThumbsApi]);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  //add cart on server side not using now
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const response = await fetch(`/api/cart/update/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          color: product.variants[selectedVariantIndex].color,
          size: selectedSize,
        }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      alert(`Added ${quantity} ${product.name} to cart`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Add to cart failed");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <nav className="flex text-sm font-medium">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-black transition-colors duration-200"
            >
              Home
            </Link>
            <span className="mx-3 text-gray-300">/</span>
            <Link 
              href="/shop/products" 
              className="text-gray-500 hover:text-black transition-colors duration-200"
            >
              Products
            </Link>
            <span className="mx-3 text-gray-300">/</span>
            <span className="text-black">{product?.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Product Images Section */}
          <div className="space-y-6">
            {/* Main Carousel */}
            <div className="relative group">
              <div
                className="embla overflow-hidden rounded-2xl bg-gray-50 shadow-sm"
                ref={emblaRef}
              >
                <div className="embla__container">
                  {product.variants[selectedVariantIndex].images.map(
                    (image, index) => (
                      <div className="embla__slide aspect-square" key={index}>
                        <Image
                          src={
                            `${image}?tr=w-800,h-800,cm-pad_resize,bg-FFFFFF` ||
                            "/placeholder.svg"
                          }
                          alt={product.name}
                          width={800}
                          height={800}
                          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                          priority
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Navigation Arrows */}
                {currentVariantImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      disabled={!canScrollPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!canScrollNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Dots Pagination */}
              {currentVariantImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {scrollSnaps.map((_, index) => (
                    <DotButton
                      key={index}
                      onClick={() => onDotButtonIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        index === selectedIndex 
                          ? "bg-black w-8" 
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Variant Thumbnails */}
            <div className="flex gap-3 p-2 overflow-x-auto scrollbar-hide">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.color}
                  onClick={() => {
                    setSelectedVariantIndex(index);
                    emblaApi?.scrollTo(0);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden transition-all duration-200 ${
                    selectedVariantIndex === index
                      ? "shadow shadow-gray-300 border border-gray-300"
                      : "shadow"
                  }`}
                >
                  <Image
                    src={variant.images[0] || "/placeholder.svg"}
                    alt={variant.color}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information Section */}
          <div className="space-y-4">
            {/* Product Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-primary leading-tight">
                {product?.name}
              </h1>
              <p className="text-gray-400 font-thin">
                Brand: {product?.brand}
              </p>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-100">
              <span className="text-2xl font-bold text-primary">
                ₹{product?.price.toLocaleString()}
              </span>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-black">Color</h3>
                <span className="text-sm text-gray-600 capitalize">
                  {product?.variants[selectedVariantIndex].color}
                </span>
              </div>
              <div className="flex gap-3">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.color}
                    onClick={() => {
                      setSelectedVariantIndex(index);
                      emblaApi?.scrollTo(0);
                    }}
                    className={`w-10 h-10 rounded-full border transition-all duration-200 ${
                      selectedVariantIndex === index
                        ? "border-black ring-1 ring-gray-500 ring-offset-2"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: variant.color }}
                    title={variant.color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            {product?.sizes && product.sizes[0] !== "NA" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-black">Size</h3>
                  {selectedSize && (
                    <span className="text-sm text-gray-600">{selectedSize}</span>
                  )}
                </div>
                <div className="grid grid-cols-6 gap-2 md:grid-cols-10">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 w-12 flex items-center justify-center border border-gray-400 rounded-xl font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-400 text-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">Size</h3>
                <p className="text-gray-600 py-3 px-4 bg-gray-50 rounded-lg">
                  Size not applicable for this product
                </p>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-black">Quantity</h3>
              <div className="flex items-center border border-gray-400 rounded-lg w-fit">
                <button
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-200 m-1"
                  onClick={() => handleQuantityChange("decrease")}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  className="w-16 h-12 text-center border-0 focus:ring-0 font-medium"
                  readOnly
                />
                <button
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-200 m-1"
                  onClick={() => handleQuantityChange("increase")}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <Button
                className="w-full h-14 bg-black hover:bg-gray-800 text-white font-medium text-lg rounded transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={handleBuyNow}
              >
                <Heart className="mr-3 h-5 w-5" />
                Buy Now - Through WhatsApp
              </Button>

              <AddToCartButton
                product={{
                  id: product?._id,
                  name: product?.name,
                  vallyId: product?.vallyId,
                  price: product?.price,
                  size: selectedSize,
                  image: product?.image,
                  color:
                    product?.variants[selectedVariantIndex]?.color ||
                    "Colour not selected",
                  quantity: 1,
                }}
                varient={"outline"}
                className="w-full h-14 border border-black text-black hover:bg-black hover:text-white font-medium text-lg rounded transition-all duration-200"
              />
            </div>

            {/* Product Meta & Share */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Product ID:</span> {product?.vallyId?.toString()}
              </div>
              <button
                onClick={handleShare}
                className="flex items-center text-sm text-gray-600 hover:text-black transition-colors duration-200 font-medium"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Product
              </button>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-20">
          <div className="border-b border-gray-200">
            <button className="px-6 py-4 font-medium text-black border-b-2 border-black text-lg">
              Product Description
            </button>
          </div>

          <div className="py-8">
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                {product?.description || "No description available for this product."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


//code of product details page improved 