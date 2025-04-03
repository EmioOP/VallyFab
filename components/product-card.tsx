"use client"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
// import { Badge } from "./ui/badge"
import { IProduct } from "@/model/productModel"



export default function ProductCard({
  _id,
  name,
  price,
  image,
  category,
}: IProduct) {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-100">
        <Link href={`/shop/products/${_id}`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* {isNew && (
            <Badge variant="accent" className="text-xs">
              New
            </Badge>
          )}
          {isSale && (
            <Badge variant="secondary" className="text-xs">
              Sale
            </Badge>
          )} */}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link
            href={`/shop/products/${_id}`}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-gray-100"
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-primary">
            <Link href={`/products/${_id}`}>{name}</Link>
          </h3>
          <p className="mt-1 text-xs text-gray-500">{category?.name}</p>
        </div>
        <div className="text-right">
            <p className="text-sm font-medium text-primary">{formatPrice(price)}</p>
        </div>
      </div>
    </div>
  )
}

