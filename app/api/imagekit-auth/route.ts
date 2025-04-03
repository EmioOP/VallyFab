import ImageKit from "imagekit"
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {
    try {
        const authenticationParameter = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameter)
    } catch (error) {
        console.log("Imagekit authentication error",error)
        return NextResponse.json({error:"Imagekit authentication error"},{status:500})
    }
 
}

export async function fileDelete(fileId : any){
    try {
        
        //check if file id is a single string or array

        const fileDeleted = imagekit.deleteFile(fileId,(error,result)=>{
            if(error) console.log(error);
            else console.log(result);
        })

        console.log(fileDeleted)

        return NextResponse.json(fileDeleted)

    } catch (error) {
        console.log("Imagekit file delete error",error)
        return NextResponse.json({error:"Imagekit file delete error"},{status:500})
    }
}