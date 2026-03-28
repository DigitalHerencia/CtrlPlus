export interface CreateVisualizerPreviewInput {
    wrapId: string
    file: File
}

export interface RegenerateVisualizerPreviewInput {
    previewId: string
}

export interface ProcessVisualizerPreviewInput {
    previewId: string
}

export type UploadPhotoInput = CreateVisualizerPreviewInput
export type GeneratePreviewInput = ProcessVisualizerPreviewInput
