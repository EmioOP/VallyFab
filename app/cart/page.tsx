"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2 } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products">
          <Button className="bg-rosegold hover:bg-rosegold/90">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Price</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Quantity</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500 sr-only">Actions</th>
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
                          <Link href={`/products/${item.id}`} className="font-medium text-primary hover:text-rosegold">
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatPrice(item.price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center border rounded-md w-32">
                        <button
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                          className="w-12 text-center border-0 focus:ring-0"
                        />
                        <button
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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

          <div className="mt-6 flex justify-between items-center">
            <Link href="/shop/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Button variant="outline" className="text-red-500 hover:bg-red-50">
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold text-primary">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
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
                <span className="font-bold text-lg">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-rosegold hover:bg-rosegold/90">Proceed to Checkout</Button>
              <div className="text-xs text-center text-gray-500">Taxes and shipping calculated at checkout</div>
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
  )
}

