import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Product from "@/model/productModel"
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
        console.log("this gives you user details",session.user)
        await connectDB();

        const body = await request.json();

        // Validate required fields including vallyId and images array
        if (!body.name || !body.vallyId || !body.price || !body.category || 
            !body.brand || !body.sizes || !body.images || !body.stock ||!body.colors || !body.material ) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Ensure images array has exactly 4 elements
        if (!Array.isArray(body.images) || body.images.length !== 4) {
            return NextResponse.json({ error: "Exactly 4 images required" }, { status: 400 });
        }

        // Create product with images array
        const product = await Product.create({
            name: body.name,
            vallyId: body.vallyId,
            description: body.description,
            price: body.price,
            category: body.category,
            subCategory: body.subCategory,
            brand: body.brand,
            sizes: body.sizes,
            images: body.images.map((image: string) => 
                `${process.env.NEXT_PUBLIC_URL_ENDPOINT}${image}`
            ),
            material:body.material,
            colors:body.colors,
            fabricSize:body.fabricSize || "",
            typeOfProduct:body.typeOfProduct,
            stock: body.stock
        });

        if (!product) {
            return NextResponse.json({ error: "Product creation failed" }, { status: 400 });
        }
        console.log(product)

        return NextResponse.json({ product }, { status: 201 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}