import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Contact from "@/model/contactModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }

        await connectDB()

        const { id } = await params

        const contact = await Contact.findById(id)

        if (!contact) {
            return NextResponse.json({ error: "Unable to find the conatct" }, { status: 404 });
        }

        return NextResponse.json({message:"success",contact},{status:200})


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

        await connectDB()

        const { id } = await params
        //toggle the contacted by team field
        const contact = await Contact.findById(id)

        if (!contact) {
            return NextResponse.json({ error: "Unable to find the conatct" }, { status: 404 });
        }

        contact.isContactedByTeam = !contact.isContactedByTeam
        const updatedContact = await contact.save({validateBeforeSave:false})

        if (!updatedContact) { 
            return NextResponse.json({ error: "Unable to update the conatcted by team" }, { status: 404 });
        }

        return NextResponse.json({message:"success",contact},{status:200})


    } catch (error: any) {
        console.log("Register error", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}