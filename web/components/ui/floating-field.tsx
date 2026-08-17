'use client'

import * as React from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingFieldProps {
    label: string
    htmlFor: string
    required?: boolean
    error?: string
    icon?: LucideIcon
    trailing?: React.ReactNode
    multiline?: boolean
    className?: string
    children: React.ReactElement<{ className?: string; placeholder?: string; id?: string }>
}

const FloatingField = ({
    label,
    htmlFor,
    required,
    error,
    icon: Icon,
    trailing,
    multiline,
    className,
    children
}: FloatingFieldProps) => {
    const field = React.cloneElement(children, {
        id: htmlFor,
        placeholder: children.props.placeholder ?? ' ',
        className: cn(
            children.props.className,
            'peer placeholder:opacity-0 focus:placeholder:opacity-100',
            Icon && 'pl-9'
        )
    })

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <div className={cn('relative', multiline && 'flex min-h-0 flex-1 flex-col')}>
                {Icon && (
                    <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                )}
                {field}
                <label
                    htmlFor={htmlFor}
                    className={cn(
                        'pointer-events-none absolute z-10 origin-left text-sm text-muted-foreground transition-all duration-150',
                        Icon ? 'left-9' : 'left-3',
                        multiline ? 'top-2.5' : 'top-1/2 -translate-y-1/2',
                        'peer-focus:top-0 peer-focus:translate-y-[-50%] peer-focus:scale-90 peer-focus:bg-card peer-focus:px-1 peer-focus:text-primary',
                        'peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:translate-y-[-50%] peer-[&:not(:placeholder-shown)]:scale-90 peer-[&:not(:placeholder-shown)]:bg-card peer-[&:not(:placeholder-shown)]:px-1 peer-[&:not(:placeholder-shown)]:text-foreground',
                        'peer-autofill:top-0 peer-autofill:translate-y-[-50%] peer-autofill:scale-90 peer-autofill:bg-card peer-autofill:px-1 peer-autofill:text-foreground',
                        Icon && 'peer-focus:left-3 peer-[&:not(:placeholder-shown)]:left-3 peer-autofill:left-3'
                    )}
                >
                    {label}
                    {required && <span className="ml-0.5 text-destructive">*</span>}
                </label>
                {trailing}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}

export { FloatingField }
