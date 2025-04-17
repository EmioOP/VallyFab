import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Contact from "@/model/contactModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    try {

        const body = await request.json()

        const { name, email, subject, content } = body
        console.log(name, email, subject, content)


        if (!name || !email || !subject || !content) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }
        await connectDB()
        const newContact = await Contact.create({
            name,
            email,
            subject,
            content
        })

        if (!newContact) {
            return NextResponse.json({ error: "unable create contact" }, { status: 500 })
        }

        return NextResponse.json({ message: "contact created successfully", newContact }, { status: 200 })

    } catch (error: any) {
        console.log("Register error", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        // logic to get all the contact info

        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }

        await connectDB()


        const contacts = await Contact.find({}).sort({ createdAt: -1 })


        if (!contacts) {
            return NextResponse.json({ error: "unable to fetch contact enquires" }, { status: 500 })
        }

        return NextResponse.json({ message: "fetching contacts successfull", contacts }, { status: 200 })


    } catch (error: any) {
        console.log("Register error", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}