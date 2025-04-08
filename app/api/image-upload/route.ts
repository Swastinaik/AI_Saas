import { v2 as cloudinary } from 'cloudinary';
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';


interface cloudinaryResult{
    public_id: string;
    [key: string]: any
}

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});

export async function POST(request: NextRequest){
    const { userId} = await auth()
    if(!userId){
        return NextResponse.json({error: "unauthorized access"}, {status: 500})
    }
    try {
        const formdata = await request.formData()
        const file = formdata.get("file") as File | null
        if(!file){
            return NextResponse.json({error:"No image is uploaded"},{status: 500})
        }
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await  new Promise<cloudinaryResult>((resolve, reject)=>{
            const uploadCloudinary =cloudinary.uploader.upload_stream(
                {folder: "/image-upload"},
                (error, result)=>{
                    if(error){
                        reject(error)
                    }
                    if(result){
                    resolve(result as cloudinaryResult)
                    }
                }
            )
            uploadCloudinary.end(buffer)
            
        })
        return NextResponse.json({publicId: result.public_id},{status: 200})
    } catch (error) {
        console.log("Error occured while uploading -----/n ",error)
        return NextResponse.json({error: "Falied to upload the image"},{status: 400})
    }                                                                                   
}                


