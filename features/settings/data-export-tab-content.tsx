'use client'


import { Button } from '@/components/ui/button'
import { DownloadCloud } from 'lucide-react'


export function DataExportTabContent() {
    return (
        <div className="space-y-6">
            <section className="border border-neutral-700 bg-neutral-950/80 px-6 py-6">
                <div className="space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-100">
                        Export Your Data
                    </p>
                    <p className="text-sm text-neutral-400">
                        You can export your personal data and account records in JSON or CSV format.
                        This includes your profile, billing history, and all wrap projects.
                    </p>

                    <div className="space-y-3 border border-neutral-700 bg-neutral-900 p-4">
                        <p className="text-sm font-medium text-neutral-100">
                            Available Export Formats
                        </p>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li className="flex items-start gap-2">
                                <span className="mt-1 text-blue-600">•</span>
                                <span>
                                    <strong>JSON</strong> - Machine-readable format, ideal for data
                                    imports
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 text-blue-600">•</span>
                                <span>
                                    <strong>CSV</strong> - Spreadsheet-friendly format, easy to open
                                    in Excel
                                </span>
                            </li>
                        </ul>
                    </div>

                    <p className="text-xs text-neutral-500">
                        Exports are generated server-side and emailed to you securely. Processing
                        typically takes 5-10 minutes. You can request multiple exports.
                    </p>

                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled
                        >
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            Export as JSON
                        </Button>
                        <Button variant="outline" disabled>
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            Export as CSV
                        </Button>
                    </div>
                </div>
            </section>

            <section className="border border-neutral-700 bg-neutral-950/80 px-6 py-6">
                <div className="space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-100">
                        Export History
                    </p>
                    <p className="text-sm text-neutral-400">
                        You haven&apos;t requested any exports yet. When you do, they&apos;ll appear
                        here.
                    </p>
                </div>
            </section>
        </div>
    )
}
