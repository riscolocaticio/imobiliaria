import * as React from 'react'
import { Input, InputProps } from './input'
import { maskCpfInput } from '@/lib/format-cpf'

const CpfInput = React.forwardRef<HTMLInputElement, InputProps>(({ onChange, ...props }, ref) => (
    <Input
        {...props}
        ref={ref}
        inputMode="numeric"
        autoComplete="off"
        maxLength={14}
        placeholder={props.placeholder ?? '000.000.000-00'}
        onChange={(event) => {
            event.target.value = maskCpfInput(event.target.value)
            onChange?.(event)
        }}
    />
))
CpfInput.displayName = 'CpfInput'

export { CpfInput }
