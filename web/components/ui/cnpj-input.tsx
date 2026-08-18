import * as React from 'react'
import { Input, InputProps } from './input'
import { maskCnpjInput } from '@/lib/format-cnpj'
import { applyMaskedChange } from '@/lib/input-mask'

const CNPJ_PATTERN = '99.999.999/9999-99'

const CnpjInput = React.forwardRef<HTMLInputElement, InputProps>(({ onChange, ...props }, ref) => {
    const valorAnterior = React.useRef('')

    return (
        <Input
            {...props}
            ref={ref}
            inputMode="numeric"
            autoComplete="off"
            maxLength={18}
            placeholder={props.placeholder ?? '00.000.000/0000-00'}
            onChange={(event) => {
                applyMaskedChange(event, valorAnterior.current, CNPJ_PATTERN, maskCnpjInput)
                valorAnterior.current = event.target.value
                onChange?.(event)
            }}
        />
    )
})
CnpjInput.displayName = 'CnpjInput'

export { CnpjInput }
