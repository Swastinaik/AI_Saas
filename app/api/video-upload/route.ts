import { v2 as cloudinary } from 'cloudinary';
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Prisma, PrismaClient } from '@prisma/client';


interface cloudinaryResult{
    public_id: string;
    bytes: number;
    duration?: number;
    [key: string]: any;
}


cloudinary.config({ 
    cloud_name: process.env.ClOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});


export async function POST(request: NextRequest){
    const { userId} = await auth()
    const prisma = new PrismaClient()
    if(!userId){
        return NextResponse.json({error: "unauthorized user access"}, {status: 400})
    }
    console.log(" user verified ", userId)
    try{
    const formData = await request.formData()
    const title = formData.get("title") as String
    const description = formData.get('description') as String
    const file = formData.get("file") as File | null
    const originalSize =  11100//formData.get("originalSize") as String

    if(!file){
        return NextResponse.json({error: "No video is uploaded"},{status: 400})
    }

    if (!title || !description || !originalSize) {
        console.log("Missing required fields", { title, description, originalSize });
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const result = await new Promise<cloudinaryResult>(
        (resolve, reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "/video-upload",
                    transformation:[
                        {quality: 'auto' ,fetch_format: "mp4"}
                    ]
                },
                (error, result)=>{
                    if(error) reject(error)
                    else{
                        resolve(result as cloudinaryResult)
                    }
                }
            ).end(buffer)
        }
    )
    if (!result || !result.public_id || !result.bytes) {
        return NextResponse.json({ error: "Failed to upload video to Cloudinary" }, { status: 500 });
    }
  
    const video = await prisma.video.create({
        data:{
            title: String(title),
            descrption: String(description),
            publicId: result.public_id,
            originalSize : String(originalSize),
            compressedSize: String(result.bytes),
            duration: String(result.duration || 0)
        }
    })
   console.log('video ---', video)
    return NextResponse.json({video})
    }catch(err){
        console.error("Error while uploading video ------- ", err instanceof Error ? err.message : err);
        return NextResponse.json({ error: "Failed uploading video", details: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
    }

}