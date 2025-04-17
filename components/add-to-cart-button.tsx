"use client"

import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "@/components/cart-provider"
import { ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity"> & { quantity: number }
  varient?:string
  className?: string
}

export default function AddToCartButton({ product,varient, className="flex-1 border-rosegold text-rosegold hover:bg-rosegold/10"}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  console.log(product)

  const handleAddToCart = () => {
    addItem({



      id:product.id,
      name:product.name,
      vallyId:product.vallyId,
      price:product.price,
      size:product.size,
      image:product.image,
      color:product.color,
      quantity:product.quantity
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Button onClick={handleAddToCart} variant={varient} className={className}>
      <ShoppingBag className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}

