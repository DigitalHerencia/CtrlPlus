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

const DEFAULT_CLIP_WORD_BUDGET = 55

function parseClipWordBudget(): number {
    const raw = process.env.HF_CLIP_PROMPT_WORD_BUDGET
    const parsed = Number(raw)

    if (!Number.isFinite(parsed)) {
        return DEFAULT_CLIP_WORD_BUDGET
    }

    const normalized = Math.trunc(parsed)
    if (normalized < 20 || normalized > 120) {
        return DEFAULT_CLIP_WORD_BUDGET
    }

    return normalized
}

function clampPromptWords(value: string, maxWords = parseClipWordBudget()): string {
    const words = value.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)

    if (words.length <= maxWords) {
        return words.join(' ')
    }

    return `${words.slice(0, maxWords).join(' ')}.`
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
        'Use image 1 as the source truck and the other images as wrap references.',
        'Apply the wrap only to exterior body panels.',
        'Preserve truck identity, body shape, wheels, windows, camera angle, lighting, and background.',
        'Match reference colors, flame style, brand text look, and panel layout.',
        input.wrapDescription ? `Wrap details: ${input.wrapDescription}` : null,
        `Reference image count: ${input.referenceImageCount}.`,
    ]
        .filter(Boolean)
        .join(' ')
}

const DEFAULT_NEGATIVE_PROMPT =
    'Do not alter vehicle identity, body shape, wheels, windows, reflections, lighting, or background. No extra people, vehicles, warped geometry, duplicate panels, blur, or unreadable text artifacts.'

export function buildWrapPreviewPrompt(
    input: BuildWrapPreviewPromptInput
): WrapPreviewPromptResult {
    const trimmedTemplate = input.aiPromptTemplate?.trim() ?? ''
    const basePrompt =
        trimmedTemplate && !hasBrokenTemplateArtifacts(trimmedTemplate)
            ? applyTemplate(trimmedTemplate, input)
            : buildDefaultPrompt(input)

    const negativePrompt = clampPromptWords(
        input.aiNegativePrompt?.trim() || DEFAULT_NEGATIVE_PROMPT
    )
    const prompt = clampPromptWords(basePrompt)

    const promptVersion = crypto
        .createHash('sha256')
        .update(`${prompt}\n---\n${negativePrompt}`)
        .digest('hex')

    return {
        prompt,
        negativePrompt,
        promptVersion,
    }
}
