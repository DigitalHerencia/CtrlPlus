'use client'
/**
 * Components — TODO: brief module description.
 * Domain: components
 * Public: TODO (yes/no)
 */

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { useState } from 'react'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

interface CalendarClientProps {
    availableWeekdays: number[]
    selectedDate?: Date | null
    onDateSelect?: (date: Date) => void
    minDate?: Date
}

function normalizeToMidnight(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * CalendarClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function CalendarClient({
    availableWeekdays,
    selectedDate,
    onDateSelect,
    minDate,
}: CalendarClientProps) {
    const today = normalizeToMidnight(new Date())

    const [viewYear, setViewYear] = useState(today.getFullYear())
    const [viewMonth, setViewMonth] = useState(today.getMonth())

    function prevMonth() {
        if (viewMonth === 0) {
            setViewMonth(11)
            setViewYear(viewYear - 1)
            return
        }
        setViewMonth(viewMonth - 1)
    }

    function nextMonth() {
        if (viewMonth === 11) {
            setViewMonth(0)
            setViewYear(viewYear + 1)
            return
        }
        setViewMonth(viewMonth + 1)
    }

    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const minDay = minDate ? normalizeToMidnight(minDate) : today

    function isDayAvailable(day: number): boolean {
        const date = new Date(viewYear, viewMonth, day)
        if (date < minDay) return false
        return availableWeekdays.includes(date.getDay())
    }

    function isDaySelected(day: number): boolean {
        if (!selectedDate) return false
        const date = new Date(viewYear, viewMonth, day)
        return (
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getDate() === selectedDate.getDate()
        )
    }

    function isToday(day: number): boolean {
        return (
            viewYear === today.getFullYear() &&
            viewMonth === today.getMonth() &&
            day === today.getDate()
        )
    }

    const cells: (number | null)[] = []
    for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    return (
        <div className="w-full max-w-sm border border-neutral-700 bg-neutral-900 p-3">
            <div className="mb-4 flex items-center justify-between">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={prevMonth}
                    aria-label="Previous month"
                >
                    ‹
                </Button>
                <span className="text-sm font-semibold text-neutral-100">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
                    ›
                </Button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1">
                {DAYS_OF_WEEK.map((d) => (
                    <div key={d} className="py-1 text-center text-xs font-medium text-neutral-100">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, idx) => {
                    if (day === null) {
                        return <div key={`empty-${idx}`} />
                    }
                    const available = isDayAvailable(day)
                    const selected = isDaySelected(day)
                    const todayCell = isToday(day)

                    return (
                        <button
                            key={day}
                            disabled={!available}
                            onClick={() => onDateSelect?.(new Date(viewYear, viewMonth, day))}
                            className={cn(
                                'h-9 w-full text-sm transition-colors',
                                available && !selected
                                    ? 'cursor-pointer text-neutral-100 hover:bg-blue-600/15'
                                    : '',
                                selected ? 'bg-blue-600 text-neutral-100 hover:bg-blue-600' : '',
                                todayCell && !selected
                                    ? 'border border-blue-600 font-medium text-neutral-100'
                                    : '',
                                !available && 'cursor-not-allowed text-neutral-100 opacity-50'
                            )}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            {availableWeekdays.length === 0 && (
                <p className="mt-4 text-center text-sm text-neutral-100">
                    No availability configured.
                </p>
            )}
        </div>
    )
}
