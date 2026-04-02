import crypto from 'crypto'

export interface BuildWrapPreviewPromptInput {
    wrapName: string
    wrapDescription: string | null
    wrapTextureUrl: string
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
        .replaceAll('{{wrap_texture_url}}', input.wrapTextureUrl)
}

function buildDefaultPrompt(input: BuildWrapPreviewPromptInput): string {
    return [
        'Use the provided vehicle photo as the base image.',
        'Create a professional commercial vehicle wrap concept on the same vehicle.',
        'Apply branding inspired by the selected wrap reference texture.',
        'Use the logo style, color palette, gradients, and graphic language from the wrap reference.',
        'Keep the same vehicle, same camera angle, same wheels, same windows, same environment, and same overall composition.',
        input.wrapDescription ? `Wrap details: ${input.wrapDescription}` : null,
        `Wrap reference image URL: ${input.wrapTextureUrl}.`,
    ]
        .filter(Boolean)
        .join(' ')
}

const DEFAULT_NEGATIVE_PROMPT =
    'Do not change the vehicle model, body shape, wheels, windows, mirrors, or scene background. Do not add people, extra vehicles, text artifacts, duplicated body panels, distorted wheels, melted surfaces, blurry output, or incorrect perspective.'

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
