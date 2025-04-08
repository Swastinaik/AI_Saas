import { Decimal } from "@prisma/client/runtime/library"

export interface Video {
    id: string
    title: string
    descrption: string
    publicId: string
    originalSize: string
    compressedSize: string
    duration: string
    createdAt: Date
    updatedAt: Date
}
