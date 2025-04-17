"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart, Share2, Star, ShoppingCart } from "lucide-react";
import AddToCartButton from "@/components/add-to-cart-button";
import { IProduct } from "@/model/productModel";
// import { DotButton, useDotButton } from './EmblaCarouselDotButton';

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

export default function ProductDetailPage() {
  const params = useParams();
  // const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [error, setError] = useState("");

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const handleBuyNow = () => {
    if (!product) return;
    const phoneNumber = process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER;
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

  // Fetch Products
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
          {/* Main Carousel */}
          <div className="embla overflow-hidden rounded-lg" ref={emblaRef}>
            <div className="embla__container">
              {product.variants[selectedVariantIndex].images.map(
                (image, index) => (
                  <div className="embla__slide aspect-square" key={index}>
                    <Image
                      src={image || "/placeholder.svg"}
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
          </div>

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

          {/* Thumbnail Carousel */}
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

        {/* Product Info */}
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

          {product.sizes && (
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
          )}

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
                id:product._id,
                name:product.name,
                vallyId:product.vallyId,
                price:product.price,
                size:selectedSize,
                image:product.image,
                color:product.variants[selectedVariantIndex].color || "Colour not selected",
                quantity:1
              }}
              className={
                "flex-1 border-rosegold text-rosegold hover:bg-rosegold/10"
              }
            />

            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1 border-rosegold text-rosegold hover:bg-rosegold/10"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>

          <div className="pt-4 border-t flex items-center justify-between text-sm text-gray-500">
            <div>Vally ID: {product.vallyId?.toString()}</div>
            <button className="flex items-center hover:text-rosegold">
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button className="px-4 py-2 font-medium text-rosegold border-b-2 border-rosegold">
              Product Details
            </button>
          </div>
        </div>

        <div className="py-6">
          <div className="prose max-w-none text-gray-600">
            <h4 className="text-primary font-medium mb-1">Material:</h4>
            <p className="text-gray-600">
              {product.material || "No Fabric Details Available"}
            </p>

            <h4 className="text-primary font-medium mb-1">Type:</h4>
            <p className="text-gray-600">
              {product.typeOfProduct || "Type Not Available"}
            </p>

            {product.fabricSize && (
              <div>
                <h4 className="text-primary font-medium mb-1">Fabric Size:</h4>
                <p>
                  {product.fabricSize ||
                    "Fabric Length and Width are not Applicable"}
                </p>
              </div>
            )}

            <h4 className="text-primary font-medium mb-1">Description:</h4>
            <p className="text-gray-600 ">
              {product.description || "No description available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Embla Carousel Dot Button Component
