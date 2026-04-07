/**
 * HuggingFace Inference API – img2img and inpainting client.
 *
 * TypeScript adaptation of the Stable Diffusion img2img / inpainting pipeline.
 *
 * ## Python → TypeScript equivalence
 *
 *   Python (manual loop)                   | This module
 *   ——————————————————————————————————————|——————————————————————————————————————
 *   vae.encode(init_image)                 | boardBuffer (already a rendered PNG)
 *   scheduler.add_noise(latents, t_start)  | HF `strength` param controls t_start
 *   unet(latent_model_input, t, embeddings)| `client.imageToImage()` server-side
 *   scheduler.step() denoising loop        | handled inside the HF pipeline
 *   vae.decode(latents)                    | returned as a Blob by the API
 *   mask_image (inpainting loop)           | `mask_image` inference parameter
 *
 * The `strength` value (0–1) maps directly to how far into the scheduler
 * timesteps we start:
 *   t_start = num_steps - min(int(num_steps * strength), num_steps)
 * A strength of 0 keeps the image unchanged; 1 fully regenerates it.
 *
 * When a `boardMaskBuffer` is supplied the call becomes an inpainting request
 * (equivalent to `StableDiffusionInpaintPipeline`) — white pixels in the mask
 * are repainted, black pixels are preserved. Without a mask the call is a
 * pure img2img transformation (equivalent to `StableDiffusionImg2ImgPipeline`).
 */

import {
    createHfClient,
    getHfImg2ImgStrength,
    getHfInferenceProvider,
} from '@/lib/visualizer/huggingface/client'
import { HuggingFaceGenerationError } from '@/lib/visualizer/huggingface/map-hf-error'

export interface Img2ImgInput {
    /** Source image as a PNG/JPEG Buffer (the composed board image). */
    boardBuffer: Buffer
    /**
     * Binary mask Buffer where white = regenerate, black = preserve.
     * Supplying this switches the HF pipeline to inpainting mode.
     * Omit (or pass null) for a pure img2img transformation.
     */
    boardMaskBuffer?: Buffer | null
    prompt: string
    negativePrompt: string
    model: string
    /**
     * Override the globally configured strength just for this call.
     * Falls back to `getHfImg2ImgStrength()` (env `HF_IMG2IMG_STRENGTH`).
     */
    strength?: number
}

/**
 * Converts a Buffer to a Blob so the HF Inference SDK can send it
 * as multipart form-data to the pipeline endpoint.
 */
function bufferToBlob(buffer: Buffer, mimeType = 'image/png'): Blob {
    return new Blob([new Uint8Array(buffer)], { type: mimeType })
}

/**
 * Reads a Blob returned by the HF Inference API back into a Node.js Buffer.
 */
async function blobToBuffer(blob: Blob): Promise<Buffer> {
    return Buffer.from(await blob.arrayBuffer())
}

/**
 * Calls the HuggingFace Inference API `imageToImage` task.
 *
 * With a mask → behaves as StableDiffusionInpaintPipeline (masked inpainting).
 * Without a mask → behaves as StableDiffusionImg2ImgPipeline (guided restyle).
 *
 * Returns the generated image as a raw PNG Buffer.
 */
export async function generateViaHfImg2Img(input: Img2ImgInput): Promise<Buffer> {
    const client = createHfClient()
    const strength = input.strength ?? getHfImg2ImgStrength()
    const providerFromEnv = getHfInferenceProvider()
    const provider: 'hf-inference' =
        providerFromEnv === 'hf-inference' ? 'hf-inference' : 'hf-inference'

    // Validate strength mirrors Python's `min(int(num_steps * strength), num_steps)` guard.
    if (strength < 0 || strength > 1) {
        throw new HuggingFaceGenerationError(
            `img2img_invalid_strength:strength must be between 0 and 1, got ${strength}`
        )
    }

    const sourceBlob = bufferToBlob(input.boardBuffer)

    // Build inference parameters — these map directly to the SD pipeline kwargs.
    const parameters: Record<string, unknown> = {
        prompt: input.prompt,
        negative_prompt: input.negativePrompt,
        // `strength` drives how many denoising timesteps are performed starting
        // from the noised init latents, identical to the Python `strength` arg.
        strength,
        // Reasonable defaults consistent with the Python examples (can be made
        // configurable via additional env vars if needed later).
        guidance_scale: 7.5,
        num_inference_steps: 30,
    }

    // Inpainting mode: include the mask so the pipeline only regenerates
    // the white (vehicle-body) region, preserving the background. This is
    // the TypeScript equivalent of the Python inpainting loop that re-blends
    // init_image_latents into non-masked latents at each denoising step.
    if (input.boardMaskBuffer && input.boardMaskBuffer.length > 0) {
        parameters.mask_image = bufferToBlob(input.boardMaskBuffer)
    }

    let resultBlob: Blob
    try {
        resultBlob = await client.imageToImage({
            model: input.model,
            provider,
            inputs: sourceBlob,
            parameters,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw new HuggingFaceGenerationError(`img2img_api_error:${message}`)
    }

    if (!resultBlob || resultBlob.size === 0) {
        throw new HuggingFaceGenerationError(
            'img2img_empty_response:HF imageToImage returned an empty blob'
        )
    }

    return blobToBuffer(resultBlob)
}
