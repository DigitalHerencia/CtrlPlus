export const STANDARD_APPOINTMENT_WEEKDAYS = [1, 2, 3, 4, 5] as const
export const STANDARD_APPOINTMENT_START_HOUR = 8
export const STANDARD_APPOINTMENT_END_HOUR = 18
export const STANDARD_APPOINTMENT_DURATION_MINUTES = 60
export const STANDARD_APPOINTMENT_SLOT_CAPACITY = 1

export interface StandardAppointmentWindow {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacity: number
}

function pad2(value: number): string {
    return String(value).padStart(2, '0')
}

export function createStandardAppointmentWindows(): StandardAppointmentWindow[] {
    const windows: StandardAppointmentWindow[] = []

    for (const dayOfWeek of STANDARD_APPOINTMENT_WEEKDAYS) {
        for (
            let hour = STANDARD_APPOINTMENT_START_HOUR;
            hour < STANDARD_APPOINTMENT_END_HOUR;
            hour += 1
        ) {
            windows.push({
                id: `standard-${dayOfWeek}-${hour}`,
                dayOfWeek,
                startTime: `${pad2(hour)}:00`,
                endTime: `${pad2(hour + 1)}:00`,
                capacity: STANDARD_APPOINTMENT_SLOT_CAPACITY,
            })
        }
    }

    return windows
}
