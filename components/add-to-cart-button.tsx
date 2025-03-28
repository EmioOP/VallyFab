"use client"

import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "@/components/cart-provider"
import { ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity"> & { quantity: number }
  className?: string
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Button onClick={handleAddToCart} className={className}>
      <ShoppingBag className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}

