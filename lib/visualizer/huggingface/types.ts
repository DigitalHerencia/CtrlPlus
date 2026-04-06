export interface GenerateWrapPreviewInput {
    model: string
    prompt: string
    negativePrompt: string
    boardBuffer: Buffer
}

export interface GenerateWrapPreviewResult {
    imageBuffer: Buffer
    model: string
}
