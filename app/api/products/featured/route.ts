import { connectDB } from "@/lib/db";
import Product from "@/model/productModel";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FeaturedProduct from "@/model/featuredProductModel";


export async function GET() {
  try {
    await connectDB()

    const featuredProducts = await FeaturedProduct.find({ isActive: true })
      .populate({
        path: 'productId',
        select: '_id name description price image'
      })
      .sort({ order: 1 })
      .limit(4)

    const products = featuredProducts.map(fp => fp.productId)


    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }

        const {productIds} = await request.json();


        await connectDB()


        // deleting already present featuredproducts if any
        await FeaturedProduct.deleteMany({})


        const featuredProducts = await Promise.all(
            productIds.map((productId:string, index:number)=> FeaturedProduct.create({
                productId,
                order:index,
                isActive:true
            }))
        )

        return NextResponse.json({
            message:"Featured Product Updated Successfully",
            count: featuredProducts.length
        })

    } catch (error: any) {
        console.log(error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}