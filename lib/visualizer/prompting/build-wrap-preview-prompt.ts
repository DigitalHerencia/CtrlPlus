import crypto from 'crypto'

export interface BuildWrapPreviewPromptInput {
    wrapName: string
    wrapDescription: string | null
    referenceImageCount: number
    aiPromptTemplate: string | null
    aiNegativePrompt?: string | null
}

export interface WrapPreviewPromptResult {
    prompt: string
    negativePrompt: string
    promptVersion: string
}

function applyTemplate(template: string, input: BuildWrapPreviewPromptInput): string {
    return template
        .replaceAll('{{wrap_name}}', input.wrapName)
        .replaceAll('{{wrap_description}}', input.wrapDescription ?? '')
        .replaceAll('{{reference_image_count}}', String(input.referenceImageCount))
}

function buildDefaultPrompt(input: BuildWrapPreviewPromptInput): string {
    return [
        'Use the provided vehicle photo as the base image.',
        'Create a professional commercial vehicle wrap concept on the same vehicle using the supplied catalog hero and gallery references.',
        'Only modify the vehicle exterior surfaces. Preserve the same vehicle identity, body shape, camera angle, wheels, windows, reflections, lighting, background, and overall composition.',
        'Use the reference imagery to match the wrap color palette, branding, graphics, and layout style without changing the surrounding scene.',
        input.wrapDescription ? `Wrap details: ${input.wrapDescription}` : null,
        `Reference image count: ${input.referenceImageCount}.`,
    ]
        .filter(Boolean)
        .join(' ')
}

const DEFAULT_NEGATIVE_PROMPT =
    'Do not change the vehicle model, body shape, wheels, windows, mirrors, reflections, shadows, or scene background. Do not add people, extra vehicles, text artifacts, duplicated body panels, distorted wheels, melted surfaces, blurry output, or incorrect perspective.'

export function buildWrapPreviewPrompt(
    input: BuildWrapPreviewPromptInput
): WrapPreviewPromptResult {
    const basePrompt = input.aiPromptTemplate?.trim()
        ? applyTemplate(input.aiPromptTemplate, input)
        : buildDefaultPrompt(input)

    const negativePrompt = input.aiNegativePrompt?.trim() || DEFAULT_NEGATIVE_PROMPT

    const promptVersion = crypto
        .createHash('sha256')
        .update(`${basePrompt}\n---\n${negativePrompt}`)
        .digest('hex')

    return {
        prompt: basePrompt,
        negativePrompt,
        promptVersion,
    }
}
