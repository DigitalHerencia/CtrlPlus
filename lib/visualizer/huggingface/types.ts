export interface GenerateWrapPreviewInput {
    model: string
    baseVehicleImageUrl: string
    wrapTextureUrl: string
    generationBoardUrl: string
    prompt: string
    negativePrompt: string
    boardBuffer: Buffer
}

export interface GenerateWrapPreviewResult {
    imageBuffer: Buffer
    model: string
}
