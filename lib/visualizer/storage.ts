import { v2 as cloudinary } from 'cloudinary'
import { randomUUID } from 'crypto'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export function storePreviewImage(params: {
    previewId: string
    buffer: Buffer
    contentType?: string
}): Promise<string> {
    const filename = `visualizer/previews/${params.previewId}-${randomUUID()}`
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: filename,
                folder: 'visualizer/previews',
                resource_type: 'image',
                overwrite: true,
                format: 'png',
            },
            (error, result) => {
                if (error || !result || !result.secure_url) {
                    reject(error ?? new Error('Preview image storage failed.'))
                    return
                }

                resolve(result.secure_url)
            }
        )
        uploadStream.end(params.buffer)
    })
}
