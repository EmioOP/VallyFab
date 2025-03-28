import { connectDB } from "@/lib/db";
import Product from "@/model/productModel";
import Category from "@/model/categoryModel";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {

        await connectDB()
        
        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(4)
            .lean();

        if(!products){
            return NextResponse.json({error:"Unable to fetch featured Products"},{status:500})
        }

        return NextResponse.json({products},{status:200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}