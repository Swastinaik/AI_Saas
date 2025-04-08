import { NextResponse, NextRequest } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";


const prismaClient = new PrismaClient()
export async function GET(request: NextRequest){
    try {
        const videos = await prismaClient.video.findMany({
            orderBy: { createdAt: "desc"}
        })
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({error: "Failed to fetch videos "}, {status: 500})
    }finally {
        await prismaClient.$disconnect()
    }
}