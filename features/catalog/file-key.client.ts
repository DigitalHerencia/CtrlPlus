export async function fileToDataUrl(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result)
                return
            }

            reject(new Error('Failed to generate upload reference.'))
        }

        reader.onerror = () => {
            reject(reader.error ?? new Error('Failed to read selected file.'))
        }

        reader.readAsDataURL(file)
    })
}
