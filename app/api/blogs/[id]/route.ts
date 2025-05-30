import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/model/blogModel";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { fileDelete } from "../../imagekit-auth/route";
import { isValidObjectId } from "mongoose";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog id" }, { status: 400 })
    }

    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong while fetching the blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    //authenticating
    const session = await getServerSession(authOptions)
    if(session?.user?.role !== "admin"){
        return NextResponse.json({error:"unAuthorized Request"},{status:400})
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog id" }, { status: 400 })
    }

    const { title, slug, content, author, category, excert, image } = await request.json()
    console.log(image)

    const validatedImage = {
      
    }

    await connectDB();


    const post = await Blog.findByIdAndUpdate(id, {
      title,
      slug,
      content,
      author: author || "Vally",
      category: category || "Fashion",
      excert,
      image: image}, {
      new: true
    })


    if (!post) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    console.log(post)

    return NextResponse.json({ post }, { status: 200 })


  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching the blog post" },
      { status: 500 }
    )
  }
}
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if(session?.user?.role !== "admin"){
        return NextResponse.json({error:"unAuthorized Request"},{status:400})
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog id" }, { status: 400 })
    }

    await connectDB();


    const post = await Blog.findById(id)
    console.log(post)

    if (!post) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const imageDeleted = await fileDelete(post.image.fileId)
    console.log(imageDeleted)

    if(!imageDeleted){
      return NextResponse.json({ error: "unable to delete blog image" }, { status: 500 })

    }
    // delete the post from db 
    await Blog.findByIdAndDelete(id);


    return NextResponse.json({ message:"Post deleted" }, { status: 200 })


  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching the blog post" },
      { status: 500 }
    )
  }
}