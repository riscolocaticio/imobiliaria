'use client'

import * as React from 'react'
import { Input } from './input'
import { dateInputToIso, isoToDateInput, maskDateInput } from '@/lib/format-date'

export interface DateInputProps {
    id?: string
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
    ({ id, value, onChange, placeholder = 'DD/MM/AAAA', className }, ref) => {
        const [texto, setTexto] = React.useState(() => isoToDateInput(value ?? ''))

        return (
            <Input
                id={id}
                ref={ref}
                inputMode="numeric"
                autoComplete="off"
                maxLength={10}
                placeholder={placeholder}
                className={className}
                value={texto}
                onChange={(event) => {
                    const masked = maskDateInput(event.target.value)
                    setTexto(masked)
                    onChange(dateInputToIso(masked))
                }}
            />
        )
    }
)
DateInput.displayName = 'DateInput'

export { DateInput }
