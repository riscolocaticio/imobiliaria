import * as React from 'react'
import { Input, InputProps } from './input'
import { maskCpfInput } from '@/lib/format-cpf'
import { applyMaskedChange } from '@/lib/input-mask'

const CPF_PATTERN = '999.999.999-99'

const CpfInput = React.forwardRef<HTMLInputElement, InputProps>(({ onChange, ...props }, ref) => {
    const valorAnterior = React.useRef('')

    return (
        <Input
            {...props}
            ref={ref}
            inputMode="numeric"
            autoComplete="off"
            maxLength={14}
            placeholder={props.placeholder ?? '000.000.000-00'}
            onChange={(event) => {
                applyMaskedChange(event, valorAnterior.current, CPF_PATTERN, maskCpfInput)
                valorAnterior.current = event.target.value
                onChange?.(event)
            }}
        />
    )
})
CpfInput.displayName = 'CpfInput'

export { CpfInput }
