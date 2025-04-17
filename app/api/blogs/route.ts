import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/model/blogModel";
import { getServerSession } from "next-auth";
import { NextResponse,NextRequest } from "next/server";


export async function POST(request:NextRequest){
    try {
        const session = await getServerSession(authOptions)
        if(session?.user?.role !== "admin"){
            return NextResponse.json({error:"unAuthorized Request"},{status:400})
        }

        const {title,slug,content,author,category,excert,image} = await request.json()

        console.log(image)

        const imageDetails = {
          url : `${process.env.NEXT_PUBLIC_URL_ENDPOINT}${image.url}`,
          fileId: image.fileId
        }

        console.log(title,slug,content)
         
        await connectDB()

        const post = await Blog.create({
            title,
            slug,
            content,
            author:author || "Vally",
            category: category || "Fashion",
            excert,
            image:imageDetails

        })

        if(!post){
            return NextResponse.json({error:"Unable to create post"},{status:400})
        }

        console.log(post)

        return NextResponse.json({message:"successfully created post",post},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Something went wrong while creating blog"},{status:500})
    }
}

export async function GET(request: NextRequest) {
    try {
      await connectDB()
  
      const posts = await Blog.find().sort({ createdAt: -1 });

  
      return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Something went wrong while fetching blogs" },
        { status: 500 }
      );
    }
  }