"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/shop/products">
          <Button className="bg-rosegold hover:bg-rosegold/90">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const handleWhatsAppCartOrder = () => {
    try {
      const phoneNumber = process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER;
      if (!phoneNumber) {
        throw new Error("WhatsApp number is not configured");
      }

      if(!items || items.length === 0 ){
        throw new Error("Your cart is empty")
      }

      // Generate message for each cart item
      console.log(items)
      const itemsMessage = items
        .map((item, index) => {
          return `
  📦 Item ${index + 1}:
  *Product Name:* ${item.name || "Unknown Product"}
  *Vally ID:* ${item.vallyId || "N/A"}
  *Price:* ₹${item.price || 0}
  *Size:* ${item.size || "Not selected"}
  *Color:* ${item.color || "Color not available"}
  *Quantity:* ${Math.max(1, item.quantity)}`;
        })
        .join("\n");

      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => {
        return sum + (item.price || 0) * Math.max(1, item.quantity);
      }, 0);

      const message = `Hi, I want to purchase these items from my cart:
      
  ${itemsMessage}
  
  *Total Amount:* ₹${totalAmount}
  
  
Please confirm availability and proceed with the order.
  
Redirected From: ${process.env.NEXT_PUBLIC_DOMAIN}
  `;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      const newWindow = window.open(whatsappUrl, "_blank");
      if (!newWindow) {
        alert("Please allow pop-ups to complete your order");
      }
    } catch (error) {
      console.error("Cart order failed:", error);
      alert(
        error instanceof Error
          ? `Failed to place order: ${error.message}`
          : "Failed to initiate WhatsApp order"
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            {/* Mobile View */}
            <div className="lg:hidden">
              {items.map((item) => (
                <div key={item.id} className="border-b p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <Link
                          href={`/products/${item.id}`}
                          className="font-medium text-primary hover:text-rosegold"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-1 text-sm text-gray-500">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center border rounded-md w-32">
                        <button
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              Number.parseInt(e.target.value)
                            )
                          }
                          className="w-12 text-center border-0 focus:ring-0"
                        />
                        <button
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 ml-4"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="text-sm font-medium text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <table className="hidden lg:table w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Total
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 sr-only">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <Link
                            href={`/products/${item.id}`}
                            className="font-medium text-primary hover:text-rosegold"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center border rounded-md w-32">
                        <button
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              Number.parseInt(e.target.value)
                            )
                          }
                          className="w-12 text-center border-0 focus:ring-0"
                        />
                        <button
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/shop/products" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-red-500 hover:bg-red-50 w-full sm:w-auto"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold text-primary">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({totalItems} items)
                </span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t pt-4 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-rosegold hover:bg-rosegold/90" onClick={handleWhatsAppCartOrder}>
                Proceed to Checkout
              </Button>
              <div className="text-xs text-center text-gray-500">
                Taxes and shipping calculated at checkout
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">We Accept</h3>
              <div className="flex gap-2">
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
