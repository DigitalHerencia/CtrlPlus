import Link from 'next/link'
import { pruneOldPreviews } from '@/lib/platform/actions/prune-old-previews'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, Grid3x3, Layers } from 'lucide-react'

type Props = {
    capabilityFlags: {
        canManageCatalog: boolean
        canManageScheduling: boolean
        canManageBilling: boolean
    }
    confirmAppointmentAction: (_formData: FormData) => Promise<void>
    canConfirmAppointment: boolean
    createInvoiceAction: (_formData: FormData) => Promise<void>
    canCreateInvoice: boolean
}

export default function AdminManagementTools({
    capabilityFlags,
    confirmAppointmentAction,
    canConfirmAppointment,
    createInvoiceAction,
    canCreateInvoice,
}: Props) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-neutral-100">
                    Management Tools
                </CardTitle>
                <CardDescription>
                    Tools for managing the catalog, scheduling, and billing.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
                <Link
                    href="/catalog"
                    className="hover:scale-103 group border border-neutral-700 bg-neutral-900 p-5 transition-all hover:border-blue-600"
                >
                    <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-100">
                        <Grid3x3 className="h-4 w-4 text-blue-600" /> Catalog
                    </p>
                    <p className="mt-2 text-sm text-neutral-100">
                        Add, hide, or remove catalog items.
                    </p>
                </Link>
                <Link
                    href="/scheduling/bookings"
                    className="hover:scale-103 group border border-neutral-700 bg-neutral-900 p-5 transition-all hover:border-blue-600"
                >
                    <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-100">
                        <ClipboardList className="h-4 w-4 text-blue-600" /> Scheduling
                    </p>
                    <p className="mt-2 text-sm text-neutral-100">
                        Review all customer appointments.
                    </p>
                </Link>
                <Link
                    href="/billing"
                    className="hover:scale-103 group border border-neutral-700 bg-neutral-900 p-5 transition-all hover:border-blue-600"
                >
                    <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-100">
                        <Layers className="h-4 w-4 text-blue-600" /> Billing
                    </p>
                    <p className="mt-2 text-sm text-neutral-100">
                        Track invoices and payment status.
                    </p>
                </Link>
            </CardContent>
            <div className="mt-4 flex flex-col gap-2 px-4">
                {capabilityFlags.canManageScheduling && (
                    <form action={confirmAppointmentAction} className="inline">
                        <button
                            type="submit"
                            disabled={!canConfirmAppointment}
                            className="rounded bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Confirm appointment (example)
                        </button>
                    </form>
                )}

                {capabilityFlags.canManageBilling && (
                    <form action={createInvoiceAction} className="inline">
                        <button
                            type="submit"
                            disabled={!canCreateInvoice}
                            className="rounded bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Create invoice (example)
                        </button>
                    </form>
                )}

                <form action={pruneOldPreviews} className="inline">
                    <button
                        type="submit"
                        className="rounded bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-100 hover:bg-neutral-700"
                    >
                        Run maintenance (prune previews)
                    </button>
                </form>
            </div>
        </Card>
    )
}
