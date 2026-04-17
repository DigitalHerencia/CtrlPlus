'use client'

import { parseDescription } from '@/lib/utils/format-description'

interface FormattedDescriptionProps {
    description: string | null | undefined
}

export function FormattedDescription({ description }: FormattedDescriptionProps) {
    if (!description) {
        return <p className="text-sm text-neutral-400">No description available</p>
    }

    const blocks = parseDescription(description)

    if (blocks.length === 0) {
        return <p className="text-sm leading-relaxed text-neutral-300">{description}</p>
    }

    return (
        <div className="space-y-4 text-sm text-neutral-300">
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'heading':
                        return (
                            <h4
                                key={index}
                                className="font-semibold uppercase tracking-wide text-neutral-100"
                            >
                                {block.content}
                            </h4>
                        )

                    case 'bullet-list':
                        return (
                            <ul
                                key={index}
                                className="space-y-1 pl-4"
                            >
                                {Array.isArray(block.content) &&
                                    block.content.map((item, itemIndex) => (
                                        <li
                                            key={itemIndex}
                                            className="flex items-start"
                                        >
                                            <span className="mr-2 mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                            </ul>
                        )

                    case 'paragraph':
                        return (
                            <p
                                key={index}
                                className="leading-relaxed"
                            >
                                {block.content}
                            </p>
                        )

                    default:
                        return null
                }
            })}
        </div>
    )
}
