import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import SubCategory from "@/model/subCategoryModel";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }

        const { id } = await params

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid Object Id" }, { status: 400 })
        }
        await connectDB()

        const subCategory = await SubCategory.findById(id)

        if (!subCategory) {
            return NextResponse.json({ error: "Unable to find the subCategory" }, { status: 404 });
        }

        return NextResponse.json({ message: "success", subCategory }, { status: 200 })


    } catch (error: any) {
        console.log("Register error", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }

        const { id } = await params

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid Object Id" }, { status: 400 })
        }

        await connectDB()

        const subCategory = await SubCategory.findByIdAndDelete(id)

        if (!subCategory) {
            return NextResponse.json({ error: "Unable to find the subCategory" }, { status: 404 });
        }

        return NextResponse.json({ message: "success", subCategory }, { status: 200 })


    } catch (error: any) {
        console.log("Register error", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }

        const { id } = await params

        const { name, category } = await request.json()

        // Validation
        if (!name || !category) {
            return NextResponse.json(
                { error: 'Name and category are required' },
                { status: 400 }
            );
        }

        if (!isValidObjectId(id) || !isValidObjectId(category)) {
            return NextResponse.json({ error: "Invalid Object Id" }, { status: 400 })
        }

        await connectDB()

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(id,
            {
                name,
                category
            },
            {
                new: true
            })

        if (!updatedSubCategory) {
            return NextResponse.json({ error: "Unable to find the subCategory" }, { status: 404 });
        }

        return NextResponse.json({ message: "success", updatedSubCategory }, { status: 200 })


    } catch (error: any) {
        console.log("Register error", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}