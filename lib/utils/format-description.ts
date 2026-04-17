/**
 * Parses a description string and returns structured content for formatted rendering.
 * Detects potential headings, bullet points, and paragraphs.
 */
export interface ParsedDescriptionBlock {
    type: 'heading' | 'paragraph' | 'bullet-list'
    content: string | string[]
}

export function parseDescription(description: string): ParsedDescriptionBlock[] {
    if (!description || !description.trim()) {
        return []
    }

    const blocks: ParsedDescriptionBlock[] = []
    const lines = description.split('\n').map((line) => line.trim())

    let i = 0
    while (i < lines.length) {
        const line = lines[i]

        // Skip empty lines
        if (!line) {
            i++
            continue
        }

        // Detect potential heading (ALL CAPS or ends with colon)
        if (
            line.toUpperCase() === line ||
            (line.endsWith(':') && line.length < 50 && line.split(' ').length <= 4)
        ) {
            blocks.push({
                type: 'heading',
                content: line.replace(/:$/, ''),
            })
            i++
            continue
        }

        // Detect bullet point list
        if (line.startsWith('- ') || line.startsWith('• ')) {
            const bulletList: string[] = []
            while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('• '))) {
                bulletList.push(lines[i].replace(/^[-•]\s*/, ''))
                i++
            }
            blocks.push({
                type: 'bullet-list',
                content: bulletList,
            })
            continue
        }

        // Regular paragraph - collect consecutive lines
        const paragraphLines: string[] = [line]
        i++
        while (i < lines.length && lines[i] && !lines[i].toUpperCase().startsWith('- ')) {
            if (lines[i].toUpperCase() === lines[i] || lines[i].endsWith(':')) {
                break
            }
            paragraphLines.push(lines[i])
            i++
        }

        const paragraphText = paragraphLines.join(' ')
        if (paragraphText) {
            blocks.push({
                type: 'paragraph',
                content: paragraphText,
            })
        }
    }

    return blocks
}
