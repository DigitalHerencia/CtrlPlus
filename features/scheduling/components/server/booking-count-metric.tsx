type BookingCountMetricProps = {
  readonly totalBookings: number;
};

export function BookingCountMetric({ totalBookings }: BookingCountMetricProps) {
  return (
    <div className='grid gap-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3'>
      <dt className='text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]'>Scheduled bookings</dt>
      <dd className='text-2xl font-semibold text-[color:var(--text)]'>{totalBookings}</dd>
    </div>
  );
}
