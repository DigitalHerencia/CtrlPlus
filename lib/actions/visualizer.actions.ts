'use server'

import { createHash } from 'crypto'

import { after } from 'next/server'

import { buildVisualizerCacheKey } from '@/lib/cache/cache-keys'
import { getVisualizerPreviewExpiresAt } from '@/lib/cache/visualizer-cache'
import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import { visualizerPreviewDTOFields } from '@/lib/db/selects/visualizer.selects'
import { getVisualizerWrapSelectionById } from '@/lib/fetchers/visualizer.fetchers'
import {
    toVisualizerPreviewDTO,
    toVisualizerUploadSnapshot,
} from '@/lib/fetchers/visualizer.mappers'
import {
    createVisualizerUploadSchema,
    createVisualizerPreviewSchema,
    processVisualizerPreviewSchema,
    regenerateVisualizerPreviewSchema,
} from '@/schemas/visualizer.schemas'
import {
    normalizeVehicleUpload,
    readImageBufferFromUrl,
    readPhotoBuffer,
} from '@/lib/uploads/image-processing'
import { persistVisualizerPreviewAsset, persistVisualizerUploadAsset } from '@/lib/uploads/storage'
import { buildCloudinaryDeliveryUrl } from '@/lib/integrations/cloudinary'
import { buildSimpleWrapPreview } from '@/lib/visualizer/fallback/build-simple-wrap-preview'
import { getHfModelName } from '@/lib/visualizer/huggingface/client'
import { generateWrapPreview } from '@/lib/visualizer/huggingface/generate-wrap-preview'
import { buildGenerationInputBoard } from '@/lib/visualizer/preprocessing/build-generation-input-board'
import { buildWrapPreviewPrompt } from '@/lib/visualizer/prompting/build-wrap-preview-prompt'
import type {
    ProcessVisualizerPreviewInput,
    RegenerateVisualizerPreviewInput,
    ScheduledVisualizerProcessingInput,
    VisualizerPreviewDTO,
    VisualizerWrapPipelineResponse,
    VisualizerUploadSnapshot,
} from '@/types/visualizer.types'

type VisualizerSelectableWrap = NonNullable<
    Awaited<ReturnType<typeof getVisualizerWrapSelectionById>>
>

type VisualizerReferenceImage = NonNullable<VisualizerSelectableWrap['heroImage']>

function getVisualizerInputsFolder(ownerClerkUserId: string) {
    const root =
        process.env.CLOUDINARY_VISUALIZER_UPLOAD_FOLDER?.trim() || 'ctrlplus/visualizer/inputs'
    return `${root}/${ownerClerkUserId}`
}

function getVisualizerMasksFolder(ownerClerkUserId: string) {
    const root =
        process.env.CLOUDINARY_VISUALIZER_MASKS_FOLDER?.trim() || 'ctrlplus/visualizer/masks'
    return `${root}/${ownerClerkUserId}`
}

function getVisualizerOutputsFolder(ownerClerkUserId: string) {
    const root =
        process.env.CLOUDINARY_VISUALIZER_OUTPUTS_FOLDER?.trim() || 'ctrlplus/visualizer/outputs'
    return `${root}/${ownerClerkUserId}`
}

function buildVisualizerReferenceImages(
    wrap: VisualizerSelectableWrap
): VisualizerReferenceImage[] {
    return [wrap.heroImage, ...wrap.galleryImages].filter(
        (image): image is VisualizerReferenceImage => image != null
    )
}

function buildVisualizerReferenceSignature(wrap: VisualizerSelectableWrap) {
    const references = buildVisualizerReferenceImages(wrap)

    return createHash('sha256')
        .update(
            JSON.stringify(
                references.map((image) => ({
                    id: image.id,
                    version: image.version,
                    contentHash: image.contentHash,
                    kind: image.kind,
                }))
            )
        )
        .digest('hex')
}

function buildVisualizerPromptForWrap(wrap: VisualizerSelectableWrap) {
    return buildWrapPreviewPrompt({
        wrapName: wrap.name,
        wrapDescription: wrap.description,
        referenceImageCount: buildVisualizerReferenceImages(wrap).length,
        aiPromptTemplate: wrap.aiPromptTemplate,
        aiNegativePrompt: wrap.aiNegativePrompt,
    })
}

async function resolveVisualizerGenerationAssets(wrap: VisualizerSelectableWrap) {
    const references = buildVisualizerReferenceImages(wrap)
    const prompt = buildVisualizerPromptForWrap(wrap)
    const settledReferenceBuffers = await Promise.all(
        references.map(async (image) => {
            try {
                const buffer = await readImageBufferFromUrl(image.detailUrl)
                return {
                    status: 'fulfilled' as const,
                    value: buffer,
                    imageId: image.id,
                    detailUrl: image.detailUrl,
                }
            } catch (error) {
                return {
                    status: 'rejected' as const,
                    reason: error instanceof Error ? error.message : 'Unknown error',
                    imageId: image.id,
                    detailUrl: image.detailUrl,
                }
            }
        })
    )

    const referenceBuffers = settledReferenceBuffers.flatMap((result) =>
        result.status === 'fulfilled' ? [result.value] : []
    )
    const referenceUrls = settledReferenceBuffers
        .flatMap((result) => (result.status === 'fulfilled' ? [result.detailUrl] : []))
        .slice(0, 3)

    if (referenceBuffers.length === 0) {
        const failureReasons = settledReferenceBuffers
            .flatMap((result) =>
                result.status === 'rejected' ? [`${result.imageId}:${result.reason}`] : []
            )
            .filter((reason) => reason.trim().length > 0)
            .slice(0, 2)

        const reasonSuffix =
            failureReasons.length > 0 ? ` Reasons: ${failureReasons.join(' | ')}` : ''

        throw new Error(
            `No usable wrap reference assets were available for preview generation.${reasonSuffix}`
        )
    }

    return {
        prompt,
        referenceBuffers,
        referenceUrls,
        referenceSignature: buildVisualizerReferenceSignature(wrap),
    }
}

async function readVisualizerUploadBuffer(upload: {
    legacyUrl: string | null
    cloudinaryPublicId: string | null
    cloudinaryVersion: number | null
    cloudinaryResourceType: string | null
    cloudinaryDeliveryType: string | null
    format: string | null
}) {
    const signedCloudinaryUrl = upload.cloudinaryPublicId
        ? await buildCloudinaryDeliveryUrl(
              {
                  publicId: upload.cloudinaryPublicId,
                  version: upload.cloudinaryVersion,
                  resourceType: upload.cloudinaryResourceType ?? 'image',
                  deliveryType: upload.cloudinaryDeliveryType ?? 'authenticated',
                  format: upload.format,
              },
              'download'
          )
        : null

    const sourceUrl = signedCloudinaryUrl ?? upload.legacyUrl
    if (!sourceUrl) {
        throw new Error('Visualizer upload source image is unavailable.')
    }

    return readPhotoBuffer(sourceUrl)
}

async function getPreviewDTOForOwner(previewId: string, ownerClerkUserId: string) {
    const preview = await prisma.visualizerPreview.findFirst({
        where: {
            id: previewId,
            ownerClerkUserId,
            deletedAt: null,
        },
        select: visualizerPreviewDTOFields,
    })

    return preview ? toVisualizerPreviewDTO(preview) : null
}

async function createVisualizerUploadInternal(params: {
    ownerClerkUserId: string
    file: File
}): Promise<VisualizerUploadSnapshot> {
    const parsed = createVisualizerUploadSchema.parse({ file: params.file })
    const normalizedVehicle = await normalizeVehicleUpload(parsed.file)

    const created = await prisma.visualizerUpload.create({
        data: {
            ownerClerkUserId: params.ownerClerkUserId,
            contentHash: normalizedVehicle.hash,
            mimeType: normalizedVehicle.contentType,
            format: 'png',
            bytes: normalizedVehicle.buffer.length,
            width: normalizedVehicle.width,
            height: normalizedVehicle.height,
            originalFileName: parsed.file.name || null,
        },
        select: {
            id: true,
            ownerClerkUserId: true,
            mimeType: true,
            width: true,
            height: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    const storedAsset = await persistVisualizerUploadAsset({
        uploadId: created.id,
        ownerClerkUserId: params.ownerClerkUserId,
        buffer: normalizedVehicle.buffer,
        contentType: normalizedVehicle.contentType,
        fileName: parsed.file.name || null,
        folder: getVisualizerInputsFolder(params.ownerClerkUserId),
        metadata: {
            contentHash: normalizedVehicle.hash,
        },
    })

    const upload = await prisma.visualizerUpload.update({
        where: { id: created.id },
        data: {
            legacyUrl: storedAsset.secureUrl,
            cloudinaryAssetId: storedAsset.assetId,
            cloudinaryPublicId: storedAsset.publicId,
            cloudinaryVersion: storedAsset.version,
            cloudinaryResourceType: storedAsset.resourceType,
            cloudinaryDeliveryType: storedAsset.deliveryType,
            cloudinaryAssetFolder: storedAsset.assetFolder,
            mimeType: storedAsset.mimeType,
            format: storedAsset.format,
            bytes: storedAsset.bytes,
            width: storedAsset.width,
            height: storedAsset.height,
            contentHash: storedAsset.contentHash,
            originalFileName: storedAsset.originalFileName,
        },
        select: {
            id: true,
            mimeType: true,
            width: true,
            height: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId: params.ownerClerkUserId,
            action: 'visualizerUpload.created',
            resourceType: 'VisualizerUpload',
            resourceId: created.id,
            details: JSON.stringify({
                cloudinaryAssetId: storedAsset.assetId,
                cloudinaryPublicId: storedAsset.publicId,
                deliveryType: storedAsset.deliveryType,
                contentHash: storedAsset.contentHash,
            }),
            timestamp: new Date(),
        },
    })

    return toVisualizerUploadSnapshot(upload)
}

export async function createVisualizerUpload(input: {
    file: File
}): Promise<VisualizerUploadSnapshot> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'visualizer.use')

    return createVisualizerUploadInternal({
        ownerClerkUserId: userId,
        file: input.file,
    })
}

async function completePreviewWithAsset(params: {
    previewId: string
    ownerClerkUserId: string
    status: 'complete' | 'failed'
    storedAsset?: Awaited<ReturnType<typeof persistVisualizerPreviewAsset>>
    promptVersion: string | null
    generationMode: string
    generationProvider: string | null
    generationModel: string | null
    generationFallbackReason: string | null
}) {
    await prisma.visualizerPreview.update({
        where: { id: params.previewId },
        data: {
            status: params.status,
            processedImageUrl: params.storedAsset?.secureUrl ?? null,
            resultLegacyUrl: params.storedAsset?.secureUrl ?? null,
            resultCloudinaryAssetId: params.storedAsset?.assetId ?? null,
            resultCloudinaryPublicId: params.storedAsset?.publicId ?? null,
            resultCloudinaryVersion: params.storedAsset?.version ?? null,
            resultCloudinaryResourceType: params.storedAsset?.resourceType ?? null,
            resultCloudinaryDeliveryType: params.storedAsset?.deliveryType ?? null,
            resultCloudinaryAssetFolder: params.storedAsset?.assetFolder ?? null,
            resultMimeType: params.storedAsset?.mimeType ?? null,
            resultFormat: params.storedAsset?.format ?? null,
            resultBytes: params.storedAsset?.bytes ?? null,
            resultWidth: params.storedAsset?.width ?? null,
            resultHeight: params.storedAsset?.height ?? null,
            generationMode: params.generationMode,
            generationProvider: params.generationProvider,
            generationModel: params.generationModel,
            generationPromptVersion: params.promptVersion,
            generationFallbackReason: params.generationFallbackReason,
            expiresAt: getVisualizerPreviewExpiresAt(),
        },
    })

    const preview = await getPreviewDTOForOwner(params.previewId, params.ownerClerkUserId)
    if (!preview) {
        throw new Error('Preview not found after completion.')
    }

    return preview
}

async function processVisualizerPreviewForOwner({
    previewId,
    ownerClerkUserId,
    includeHidden,
}: ScheduledVisualizerProcessingInput): Promise<VisualizerPreviewDTO> {
    const preview = await prisma.visualizerPreview.findFirst({
        where: {
            id: previewId,
            ownerClerkUserId,
            deletedAt: null,
        },
        include: {
            upload: true,
        },
    })

    if (!preview) {
        throw new Error('Preview not found.')
    }

    if (
        preview.status === 'complete' &&
        (preview.resultCloudinaryPublicId || preview.resultLegacyUrl || preview.processedImageUrl)
    ) {
        const existing = await getPreviewDTOForOwner(preview.id, ownerClerkUserId)
        if (!existing) {
            throw new Error('Preview not found.')
        }

        return existing
    }

    if (preview.status === 'processing') {
        const processingPreview = await getPreviewDTOForOwner(preview.id, ownerClerkUserId)
        if (!processingPreview) {
            throw new Error('Preview not found.')
        }

        return processingPreview
    }

    const wrap = await getVisualizerWrapSelectionById(preview.wrapId, {
        includeHidden,
    })
    if (!wrap) {
        await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'failed',
                generationFallbackReason: 'Wrap not found or is not visualizer-ready.',
            },
        })

        throw new Error('Wrap not found or is not visualizer-ready.')
    }

    if (!preview.upload) {
        await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'failed',
                generationFallbackReason: 'Preview upload source is missing.',
            },
        })

        throw new Error('Preview upload source is missing.')
    }

    const referenceSignature = buildVisualizerReferenceSignature(wrap)

    await prisma.visualizerPreview.update({
        where: { id: preview.id },
        data: {
            status: 'processing',
            processedImageUrl: null,
            resultLegacyUrl: null,
            resultCloudinaryAssetId: null,
            resultCloudinaryPublicId: null,
            resultCloudinaryVersion: null,
            resultCloudinaryResourceType: null,
            resultCloudinaryDeliveryType: null,
            resultCloudinaryAssetFolder: null,
            resultMimeType: null,
            resultFormat: null,
            resultBytes: null,
            resultWidth: null,
            resultHeight: null,
            referenceSignature,
            generationMode: 'mask_guided_inpaint',
            generationProvider: 'huggingface-space',
            generationModel: getHfModelName(),
            generationPromptVersion: null,
            generationFallbackReason: null,
            sourceWrapImageId: wrap.heroImage?.id ?? null,
            sourceWrapImageVersion: wrap.heroImage?.version ?? null,
        },
    })

    const generationModel = getHfModelName()
    let vehicleBuffer: Buffer
    let prompt: ReturnType<typeof buildWrapPreviewPrompt>
    let referenceBuffers: Buffer[]
    let referenceUrls: string[]

    try {
        const [uploadBufferResult, generationAssets] = await Promise.all([
            readVisualizerUploadBuffer(preview.upload),
            resolveVisualizerGenerationAssets(wrap),
        ])

        vehicleBuffer = uploadBufferResult.buffer
        prompt = generationAssets.prompt
        referenceBuffers = generationAssets.referenceBuffers
        referenceUrls = generationAssets.referenceUrls
    } catch (error) {
        const failureReason =
            error instanceof Error
                ? error.message
                : 'Preview generation inputs could not be prepared.'

        await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'failed',
                generationFallbackReason: failureReason,
            },
        })

        await prisma.auditLog.create({
            data: {
                userId: ownerClerkUserId,
                action: 'visualizerPreview.processingFailed',
                resourceType: 'VisualizerPreview',
                resourceId: preview.id,
                details: JSON.stringify({
                    wrapId: wrap.id,
                    cacheKey: preview.cacheKey,
                    uploadId: preview.uploadId,
                    referenceSignature,
                    generationMode: 'mask_guided_inpaint',
                    generationProvider: 'huggingface-space',
                    generationModel,
                    error: failureReason,
                }),
                timestamp: new Date(),
            },
        })

        throw new Error(failureReason)
    }

    try {
        const board = await buildGenerationInputBoard({
            vehicleBuffer,
            referenceBuffers,
            wrapName: wrap.name,
        })

        const maskAsset = await persistVisualizerPreviewAsset({
            previewId: `${preview.id}-mask`,
            buffer: board.boardMaskBuffer,
            contentType: 'image/png',
            folder: getVisualizerMasksFolder(ownerClerkUserId),
            metadata: {
                wrapId: wrap.id,
                ownerClerkUserId,
                uploadId: preview.uploadId,
                referenceSignature,
                assetRole: 'visualizer_mask',
                maskStrategy: board.maskStrategy,
            },
        })

        const result = await generateWrapPreview({
            model: generationModel,
            prompt: prompt.prompt,
            negativePrompt: prompt.negativePrompt,
            boardBuffer: board.boardBuffer,
            boardMaskBuffer: board.boardMaskBuffer,
            referenceUrls,
        })

        const storedAsset = await persistVisualizerPreviewAsset({
            previewId: preview.id,
            buffer: result.imageBuffer,
            contentType: 'image/png',
            folder: getVisualizerOutputsFolder(ownerClerkUserId),
            metadata: {
                wrapId: wrap.id,
                ownerClerkUserId,
                uploadId: preview.uploadId,
                referenceSignature,
                generationMode: 'mask_guided_inpaint',
                generationProvider: 'huggingface-space',
                generationModel: result.model,
                maskStrategy: board.maskStrategy,
            },
        })

        const pipelineResponse: VisualizerWrapPipelineResponse = {
            status: result.status,
            finalImageUrl: storedAsset.secureUrl,
            maskUrl: maskAsset.secureUrl,
            referenceUrls: result.referenceUrls,
            model: result.model,
            prompt: result.prompt,
            notes: [...board.notes, ...result.notes],
        }

        await prisma.auditLog.create({
            data: {
                userId: ownerClerkUserId,
                action: 'visualizerPreview.processed',
                resourceType: 'VisualizerPreview',
                resourceId: preview.id,
                details: JSON.stringify({
                    wrapId: wrap.id,
                    cacheKey: preview.cacheKey,
                    uploadId: preview.uploadId,
                    referenceSignature,
                    promptVersion: prompt.promptVersion,
                    generationMode: 'mask_guided_inpaint',
                    generationProvider: 'huggingface-space',
                    generationModel: result.model,
                    maskAssetId: maskAsset.assetId,
                    maskStrategy: board.maskStrategy,
                    pipeline: pipelineResponse,
                    fallbackReason: null,
                }),
                timestamp: new Date(),
            },
        })

        return completePreviewWithAsset({
            previewId: preview.id,
            ownerClerkUserId,
            storedAsset,
            status: 'complete',
            promptVersion: prompt.promptVersion,
            generationMode: 'mask_guided_inpaint',
            generationProvider: 'huggingface-space',
            generationModel: result.model,
            generationFallbackReason: null,
        })
    } catch (error) {
        const fallbackReason =
            error instanceof Error ? error.message : 'Hugging Face preview generation failed.'

        try {
            const fallbackBuffer = await buildSimpleWrapPreview({
                vehicleBuffer,
                referenceBuffers,
            })
            const fallbackAsset = await persistVisualizerPreviewAsset({
                previewId: preview.id,
                buffer: fallbackBuffer,
                contentType: 'image/png',
                folder: getVisualizerOutputsFolder(ownerClerkUserId),
                metadata: {
                    wrapId: wrap.id,
                    ownerClerkUserId,
                    uploadId: preview.uploadId,
                    referenceSignature,
                    generationMode: 'deterministic_fallback',
                    generationProvider: 'fallback',
                    generationModel,
                },
            })

            await prisma.auditLog.create({
                data: {
                    userId: ownerClerkUserId,
                    action: 'visualizerPreview.processed',
                    resourceType: 'VisualizerPreview',
                    resourceId: preview.id,
                    details: JSON.stringify({
                        wrapId: wrap.id,
                        cacheKey: preview.cacheKey,
                        uploadId: preview.uploadId,
                        referenceSignature,
                        promptVersion: prompt.promptVersion,
                        generationMode: 'deterministic_fallback',
                        generationProvider: 'fallback',
                        generationModel,
                        fallbackReason,
                    }),
                    timestamp: new Date(),
                },
            })

            return completePreviewWithAsset({
                previewId: preview.id,
                ownerClerkUserId,
                storedAsset: fallbackAsset,
                status: 'complete',
                promptVersion: prompt.promptVersion,
                generationMode: 'deterministic_fallback',
                generationProvider: 'fallback',
                generationModel,
                generationFallbackReason: fallbackReason,
            })
        } catch (fallbackError) {
            const finalReason =
                fallbackError instanceof Error ? fallbackError.message : fallbackReason

            await prisma.visualizerPreview.update({
                where: { id: preview.id },
                data: {
                    status: 'failed',
                    generationFallbackReason: finalReason,
                },
            })

            await prisma.auditLog.create({
                data: {
                    userId: ownerClerkUserId,
                    action: 'visualizerPreview.processingFailed',
                    resourceType: 'VisualizerPreview',
                    resourceId: preview.id,
                    details: JSON.stringify({
                        wrapId: wrap.id,
                        cacheKey: preview.cacheKey,
                        uploadId: preview.uploadId,
                        referenceSignature,
                        generationMode: 'mask_guided_inpaint',
                        generationProvider: 'huggingface-space',
                        generationModel,
                        error: finalReason,
                    }),
                    timestamp: new Date(),
                },
            })

            throw new Error(finalReason)
        }
    }
}

function scheduleVisualizerPreviewProcessing(input: ScheduledVisualizerProcessingInput) {
    if (process.env.NODE_ENV === 'test') {
        return
    }

    after(async () => {
        try {
            await processVisualizerPreviewForOwner(input)
        } catch (error) {
            console.error('Background visualizer preview processing failed', error)
        }
    })
}

export async function createVisualizerPreview(input: {
    wrapId: string
    uploadId: string
}): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'visualizer.use')

    const parsed = createVisualizerPreviewSchema.parse(input)
    const includeHidden = session.isOwner || session.isPlatformAdmin

    const [wrap, upload] = await Promise.all([
        getVisualizerWrapSelectionById(parsed.wrapId, { includeHidden }),
        prisma.visualizerUpload.findFirst({
            where: {
                id: parsed.uploadId,
                ownerClerkUserId: userId,
                deletedAt: null,
            },
        }),
    ])

    if (!wrap) {
        throw new Error('Wrap not found or is not visualizer-ready.')
    }

    if (!upload) {
        throw new Error('Upload not found.')
    }

    const prompt = buildVisualizerPromptForWrap(wrap)
    const generationModel = getHfModelName()
    const referenceSignature = buildVisualizerReferenceSignature(wrap)

    const cacheKey = buildVisualizerCacheKey({
        wrapId: wrap.id,
        ownerUserId: userId,
        customerPhotoHash: upload.contentHash,
        uploadId: upload.id,
        referenceSignature,
        generationMode: 'mask_guided_inpaint',
        generationModel,
        promptVersion: prompt.promptVersion,
    })

    const reusablePreview = await prisma.visualizerPreview.findFirst({
        where: {
            cacheKey,
            ownerClerkUserId: userId,
            deletedAt: null,
            status: 'complete',
            expiresAt: {
                gt: new Date(),
            },
        },
    })

    if (reusablePreview) {
        const existing = await getPreviewDTOForOwner(reusablePreview.id, userId)
        if (existing) {
            return existing
        }
    }

    const preview = await prisma.visualizerPreview.create({
        data: {
            wrapId: wrap.id,
            uploadId: upload.id,
            ownerClerkUserId: userId,
            customerPhotoUrl: upload.legacyUrl ?? '',
            processedImageUrl: null,
            status: 'pending',
            cacheKey,
            referenceSignature,
            generationMode: 'mask_guided_inpaint',
            generationProvider: 'huggingface-space',
            generationModel,
            generationPromptVersion: prompt.promptVersion,
            generationFallbackReason: null,
            sourceWrapImageId: wrap.heroImage?.id ?? null,
            sourceWrapImageVersion: wrap.heroImage?.version ?? null,
            expiresAt: getVisualizerPreviewExpiresAt(),
        },
        select: { id: true },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'visualizerPreview.created',
            resourceType: 'VisualizerPreview',
            resourceId: preview.id,
            details: JSON.stringify({
                wrapId: wrap.id,
                uploadId: upload.id,
                cacheKey,
                referenceSignature,
                promptVersion: prompt.promptVersion,
                generationMode: 'mask_guided_inpaint',
                generationProvider: 'huggingface-space',
                generationModel,
            }),
            timestamp: new Date(),
        },
    })

    scheduleVisualizerPreviewProcessing({
        previewId: preview.id,
        ownerClerkUserId: userId,
        includeHidden,
    })

    const createdPreview = await getPreviewDTOForOwner(preview.id, userId)
    if (!createdPreview) {
        throw new Error('Preview not found after creation.')
    }

    return createdPreview
}

export async function regenerateVisualizerPreview(
    input: RegenerateVisualizerPreviewInput
): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'visualizer.use')

    const parsed = regenerateVisualizerPreviewSchema.parse(input)
    const preview = await prisma.visualizerPreview.findFirst({
        where: {
            id: parsed.previewId,
            ownerClerkUserId: userId,
            deletedAt: null,
        },
        select: {
            id: true,
            wrapId: true,
            uploadId: true,
            cacheKey: true,
        },
    })

    if (!preview) {
        throw new Error('Preview not found.')
    }

    await prisma.visualizerPreview.update({
        where: { id: preview.id },
        data: {
            status: 'pending',
            processedImageUrl: null,
            resultLegacyUrl: null,
            resultCloudinaryAssetId: null,
            resultCloudinaryPublicId: null,
            resultCloudinaryVersion: null,
            resultCloudinaryResourceType: null,
            resultCloudinaryDeliveryType: null,
            resultCloudinaryAssetFolder: null,
            resultMimeType: null,
            resultFormat: null,
            resultBytes: null,
            resultWidth: null,
            resultHeight: null,
            generationFallbackReason: null,
            expiresAt: getVisualizerPreviewExpiresAt(),
        },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'visualizerPreview.regenerated',
            resourceType: 'VisualizerPreview',
            resourceId: preview.id,
            details: JSON.stringify({
                wrapId: preview.wrapId,
                uploadId: preview.uploadId,
                cacheKey: preview.cacheKey,
            }),
            timestamp: new Date(),
        },
    })

    scheduleVisualizerPreviewProcessing({
        previewId: preview.id,
        ownerClerkUserId: userId,
        includeHidden: session.isOwner || session.isPlatformAdmin,
    })

    const resetPreview = await getPreviewDTOForOwner(preview.id, userId)
    if (!resetPreview) {
        throw new Error('Preview not found after reset.')
    }

    return resetPreview
}

export async function processVisualizerPreview(
    input: ProcessVisualizerPreviewInput
): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'visualizer.use')

    const parsed = processVisualizerPreviewSchema.parse(input)
    return processVisualizerPreviewForOwner({
        previewId: parsed.previewId,
        ownerClerkUserId: userId,
        includeHidden: session.isOwner || session.isPlatformAdmin,
    })
}

export async function uploadAndGeneratePreview(input: { wrapId: string; file: File }) {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'visualizer.use')

    const upload = await createVisualizerUploadInternal({
        ownerClerkUserId: userId,
        file: input.file,
    })

    return createVisualizerPreview({
        wrapId: input.wrapId,
        uploadId: upload.id,
    })
}
