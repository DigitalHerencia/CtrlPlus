import { NewInvoicePageFeature } from '@/features/billing/manage/new-invoice-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface NewInvoicePageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewInvoicePage({ searchParams }: NewInvoicePageProps) {
    const { userId } = await getSession()
    if (!userId) {
        redirect('/sign-in')
    }

    const resolvedSearchParams = await searchParams
    const initialBookingId =
        typeof resolvedSearchParams.bookingId === 'string' ? resolvedSearchParams.bookingId : ''

    return <NewInvoicePageFeature initialBookingId={initialBookingId} />
}
