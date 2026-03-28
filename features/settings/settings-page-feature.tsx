import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { getCurrentUserWebsiteSettings } from '@/lib/fetchers/settings.fetchers'

import { WebsiteSettingsFormClient } from './website-settings-form-client'

function isForbiddenError(error: unknown): boolean {
    return error instanceof Error && error.message.startsWith('Forbidden:')
}

export async function SettingsPageFeature() {
    let settings

    try {
        settings = await getCurrentUserWebsiteSettings()
    } catch (error) {
        if (!isForbiddenError(error)) {
            throw error
        }

        return (
            <div className="space-y-6">
                <WorkspacePageIntro
                    label="Website Settings"
                    title="My Website Options"
                    description="Manage your notification and contact preferences for your customer portal."
                />

                <Card className="max-w-3xl border-neutral-700 bg-neutral-950/80 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-neutral-100">
                            Access denied
                        </CardTitle>
                        <CardDescription className="text-neutral-400">
                            Your current role cannot manage website settings for this workspace.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Website Settings"
                title="My Website Options"
                description="Manage your notification and contact preferences for your customer portal."
            />

            <Card className="max-w-6xl border-neutral-700 bg-neutral-950/80 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-neutral-100">
                        Preferences
                    </CardTitle>
                    <CardDescription>These options apply only to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <WebsiteSettingsFormClient initialSettings={settings} />
                </CardContent>
            </Card>
        </div>
    )
}
