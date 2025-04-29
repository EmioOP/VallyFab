import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Product from "@/model/productModel"
import mongoose,{ isValidObjectId } from "mongoose"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url);

        // Get filter parameters
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "9");
        const query = searchParams.get("query") || "";
        const minPrice = parseFloat(searchParams.get("minPrice") || "0");
        const maxPrice = parseFloat(searchParams.get("maxPrice") || "0");
        const categoryIds = searchParams.get("categories")?.split(",").filter(Boolean) || [];
        const sortOption = searchParams.get("sort") || "featured";

        const skip = (page - 1) * limit;
        await connectDB();

        // Build the filter object dynamically
        const filter: any = {};

        // Search by name
        if (query) {
            filter.name = { $regex: query, $options: "i" };
        }

        // Filter by price range
        if (minPrice > 0 || maxPrice > 0) {
            filter.price = {};
            if (minPrice > 0) filter.price.$gte = minPrice;
            if (maxPrice > 0) filter.price.$lte = maxPrice;
        }


        const validCategoryIds = categoryIds
            .filter(id => isValidObjectId(id))
            .map(id => new mongoose.Types.ObjectId(id));

        if (validCategoryIds.length > 0) {
            filter.category = { $in: validCategoryIds };
        }

        // Filter by category
        if (categoryIds.length > 0) {
            filter.category = { $in: categoryIds };


        }

        // Sorting logic
        let sortQuery: any = {};
        if (sortOption === "price-asc") sortQuery.price = 1;
        else if (sortOption === "price-desc") sortQuery.price = -1;
        else if (sortOption === "newest") sortQuery.createdAt = -1;

        // Fetch products
        const products = await Product.find(filter)
            .populate({ path: "category", select: "name" }) // Populate category
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .lean();

        // Count total products matching the filters
        const total = await Product.countDocuments(filter);


        return NextResponse.json({ products, total }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.vallyId || !body.price || !body.category ||
            !body.brand || !body.sizes || !body.image || !body.stock ||
            !body.material || !body.typeOfProduct) {
            return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
        }

        // Validate variants structure and images
        if (!Array.isArray(body.variants)) {
            return NextResponse.json({ error: "Invalid variants format" }, { status: 400 });
        }

        for (const variant of body.variants) {
            if (!variant.color || !Array.isArray(variant.images)) {
                return NextResponse.json({ error: "Each variant must have a color and images array" }, { status: 400 });
            }
            if (variant.images.length !== 4) {
                return NextResponse.json({
                    error: `Each variant must have exactly 4 images (${variant.color} has ${variant.images.length})`
                }, { status: 400 });
            }
        }

        // Process images to include full URL if needed
        const processedVariants = body.variants.map((variant: any) => ({
            color: variant.color,
            images: variant.images.map((img: string) =>
                img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${img}`
            )
        }));

        // Create product
        const product = await Product.create({
            name: body.name,
            vallyId: body.vallyId,
            description: body.description,
            price: body.price,
            category: body.category,
            subCategory: body.subCategory,
            brand: body.brand,
            sizes: body.sizes,
            variants: processedVariants,
            image: body.image.startsWith('http')
                ? body.image
                : `${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${body.image}`,
            material: body.material,
            fabricSize: body.fabricSize || "",
            typeOfProduct: body.typeOfProduct,
            stock: body.stock
        });

        if (!product) {
            return NextResponse.json({ error: "Product creation failed" }, { status: 400 });
        }

        return NextResponse.json({ product }, { status: 201 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}