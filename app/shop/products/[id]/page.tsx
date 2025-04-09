"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart, Share2, Star, ShoppingCart } from "lucide-react";
import AddToCartButton from "@/components/add-to-cart-button";
import { IProduct } from "@/model/productModel";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


  
  const handleBuyNow = () => {
    if (!product) return;
  
    // Replace with your company's WhatsApp number (include country code without + or 00)
    const phoneNumber = process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER ;
    console.log(phoneNumber,typeof phoneNumber)
    
    // Create message template
    const message = `Hi, I want to buy the following product:
    
*Product Name:* ${product.name}
*Vally Id:* ${product.vallyId}
*Price:* ₹${product.price}
*Size:* ${selectedSize || 'Not selected'}
*Color:* ${selectedColor || 'Not selected'}
*Quantity:* ${quantity}

Please confirm availability and proceed with the order.`;
  
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    console.log(whatsappUrl)
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };


//Fetch Products
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


  //Quantity change
  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  //Add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const response = await fetch(`/api/cart/update/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          color: selectedColor,
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
      {/* Breadcrumb Navigation */}
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
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[selectedImageIndex] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square overflow-hidden rounded-md bg-gray-100 cursor-pointer border-2 ${
                  selectedImageIndex === index
                    ? "border-rosegold"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - View ${index + 1}`}
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {/* {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4 ? "fill-rosegold text-rosegold" : "text-gray-300"
                    }`}
                  />
                ))} */}
              </div>
              {/* <span className="text-sm text-gray-500">Product By:{product.brand}</span> */}
            </div>
          </div>
          <span className="text-sm text-gray-500">Product By:{product.brand}</span>

          <div className="text-2xl font-bold text-primary">
            ₹{product.price}
          </div>

          {/* <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">
              {product.description || "No description available"}
            </p>
          </div> */}

          {product.colors && (
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded-md ${
                      selectedColor === color 
                        ? "border-rosegold bg-rosegold/10 text-rosegold" 
                        : "border-gray-300 hover:border-rosegold"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

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
            <Button className="flex-1 bg-rosegold hover:bg-rosegold/90" onClick={handleBuyNow}>
              <Heart className="mr-2 h-4 w-4" />
              Buy Now - Throgh WhatsApp!
            </Button>

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
            {/* <button className="px-4 py-2 font-medium text-gray-500 hover:text-rosegold">
              Reviews
            </button>
            <button className="px-4 py-2 font-medium text-gray-500 hover:text-rosegold">
              Shipping & Returns
            </button> */}
          </div>
        </div>

        <div className="py-6">
          <div className="prose max-w-none text-gray-600">

            <h4 className="text-primary font-medium mb-2">Desciption:</h4>
            <p className="text-gray-600">
              {product.description || "No description available"}
            </p>

            <h4 className="text-primary font-medium mb-2">Material:</h4>
            <p>{product.material || "No Fabric Details Available"}</p>

            <h4 className="text-primary font-medium mb-2">Type:</h4>
            <p>{product.typeOfProduct || "Type Not Available"}</p>

              {product.fabricSize ? <div>
                <h4 className="text-primary font-medium mb-2">Fabric Size:</h4>
            <p>{product.fabricSize || "Fabric Length and Width are not Applicable"}</p>
              </div>  : "" }
            

            {/* <h4 className="text-primary font-medium mt-4 mb-2">
              Care Instructions:
            </h4> */}
            {/* <ul className="list-disc pl-5 space-y-1">
              {product.careInstructions?.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              )) || <li>Machine wash cold, tumble dry low</li>}
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
}
