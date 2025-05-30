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

// Dot Navigation Hook and Component (keep existing implementation)
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
        title: product.name,
        text: `Check out ${product.name} - ₹${product.price}`,
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

  // Return JSX with added arrows
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Existing breadcrumb navigation */}
      <div className="mb-4">
        <nav className="flex text-sm text-gray-500">
          <Link href="/" className="hover:text-rosegold">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop/products" className="hover:text-rosegold">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-8">
          {/* Main Carousel with Arrows */}
          <div
            className="embla relative overflow-hidden rounded-lg"
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
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                )
              )}
            </div>

            {currentVariantImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={!canScrollPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canScrollNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Dots Pagination */}
          {currentVariantImages.length > 1 && (
            <div className="embla__dots mt-4 flex justify-center gap-2">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === selectedIndex ? "bg-gray-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail Carousel (existing implementation) */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.variants.map((variant, index) => (
              <button
                key={variant.color}
                onClick={() => {
                  setSelectedVariantIndex(index);
                  emblaApi?.scrollTo(0); // Reset carousel to first image when variant changes
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                  selectedVariantIndex === index
                    ? "border-rosegold"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={variant.images[0] || "/placeholder.svg"}
                  alt={variant.color}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info (existing implementation) */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
            <span className="text-sm text-gray-500">
              Product By: {product.brand}
            </span>
          </div>

          <div className="text-2xl font-bold text-primary">
            ₹{product.price}
          </div>

          {/* Color Variants */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Color:</span>
            <div className="flex gap-2">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.color}
                  onClick={() => {
                    setSelectedVariantIndex(index);
                    emblaApi?.scrollTo(0);
                  }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedVariantIndex === index
                      ? "border-rosegold"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: variant.color }}
                  title={variant.color}
                />
              ))}
            </div>
          </div>

            
          {/* {product.sizes && (
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border rounded-md ${
                      selectedSize === size
                        ? "border-rosegold bg-rosegold/10 text-rosegold"
                        : "border-gray-300 hover:border-rosegold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )} */}


          {
            product?.sizes && product.sizes[0] !== "NA" ? (
              <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border rounded-md ${
                      selectedSize === size
                        ? "border-rosegold bg-rosegold/10 text-rosegold"
                        : "border-gray-300 hover:border-rosegold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            )  : (
              <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                  <button
                    className={`h-12`}>
                    Not Applicable For This Product
                  </button>
              </div>
            </div>
            )
          }

          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center border rounded-md w-32">
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary"
                onClick={() => handleQuantityChange("decrease")}
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                className="w-12 text-center border-0 focus:ring-0"
                readOnly
              />
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary"
                onClick={() => handleQuantityChange("increase")}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 bg-rosegold hover:bg-rosegold/90"
              onClick={handleBuyNow}
            >
              <Heart className="mr-2 h-4 w-4" />
              Buy Now - Through WhatsApp
            </Button>

            <AddToCartButton
              product={{
                id: product._id,
                name: product.name,
                vallyId: product.vallyId,
                price: product.price,
                size: selectedSize,
                image: product.image,
                color:
                  product.variants[selectedVariantIndex].color ||
                  "Colour not selected",
                quantity: 1,
              }}
              varient={"outline"}
              className={
                "flex-1  border-rosegold  text-rosegold hover:bg-rosegold/10"
              }
            />

            {/* <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      className="flex-1 border-rosegold text-rosegold hover:bg-rosegold/10"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button> */}
          </div>

          <div className="pt-4 border-t flex items-center justify-between text-sm text-gray-500">
            <div>Vally ID: {product.vallyId?.toString()}</div>
            <button
              onClick={handleShare} //sharing the product
              className="flex items-center hover:text-rosegold"
            >
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Product Description Section (existing implementation) */}
      <div className="mt-16">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button className="px-4 py-2 font-medium text-rosegold border-b-2 border-rosegold">
              Product Description
            </button>
          </div>
        </div>

        <div className="py-3">
          <div className="prose grid grid-cols-1 max-w-none text-gray-600">
            <div>
              <div className=" text-primary font-bold whitespace-pre-line">
                {product.description || "No description available"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
