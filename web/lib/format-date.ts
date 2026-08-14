import { format, isValid, parse, parseISO } from 'date-fns'

const DISPLAY_FORMAT = 'dd/MM/yyyy'
const ISO_FORMAT = 'yyyy-MM-dd'

export function maskDateInput(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 8)

    if (digits.length > 4) return digits.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3')
    if (digits.length > 2) return digits.replace(/(\d{2})(\d{1,2})/, '$1/$2')
    return digits
}

export function isDateInputComplete(value: string): boolean {
    return value.length === 10 && isValid(parse(value, DISPLAY_FORMAT, new Date()))
}

export function dateInputToIso(value: string): string {
    if (!isDateInputComplete(value)) return ''
    return format(parse(value, DISPLAY_FORMAT, new Date()), ISO_FORMAT)
}

export function isoToDateInput(value: string): string {
    if (!value) return ''
    const parsed = parseISO(value)
    return isValid(parsed) ? format(parsed, DISPLAY_FORMAT) : ''
}
