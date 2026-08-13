import * as React from 'react'
import { Input, InputProps } from './input'
import { maskCnpjInput } from '@/lib/format-cnpj'

const CnpjInput = React.forwardRef<HTMLInputElement, InputProps>(({ onChange, ...props }, ref) => (
    <Input
        {...props}
        ref={ref}
        inputMode="numeric"
        autoComplete="off"
        maxLength={18}
        placeholder={props.placeholder ?? '00.000.000/0000-00'}
        onChange={(event) => {
            event.target.value = maskCnpjInput(event.target.value)
            onChange?.(event)
        }}
    />
))
CnpjInput.displayName = 'CnpjInput'

export { CnpjInput }
