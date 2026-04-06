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

function hasBrokenTemplateArtifacts(template: string): boolean {
    const normalized = template.replaceAll('\r\n', '\n')

    return (
        normalized.includes("supplied catalog hero and gallery references.',") ||
        normalized.includes("overall composition.',") ||
        normalized.includes('layout style without changing the surrounding scene.') ||
        /['"],\s*\n\s*['"]/.test(normalized)
    )
}

function buildDefaultPrompt(input: BuildWrapPreviewPromptInput): string {
    return [
        'The first input image is the source vehicle photo and the remaining images are wrap reference examples.',
        'Apply the reference wrap design to the exact same truck in the source photo.',
        'Only change the painted exterior body panels and wrap graphics.',
        'Preserve the exact same truck identity, body shape, grille, lights, wheels, windows, mirrors, camera angle, background, driveway, reflections, shadows, and time of day.',
        'Match the reference wrap color palette, flame pattern, brand text treatment, and panel layout as closely as possible while keeping the source scene photorealistic.',
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
    const trimmedTemplate = input.aiPromptTemplate?.trim() ?? ''
    const basePrompt =
        trimmedTemplate && !hasBrokenTemplateArtifacts(trimmedTemplate)
            ? applyTemplate(trimmedTemplate, input)
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
