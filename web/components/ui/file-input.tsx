'use client'

import * as React from 'react'
import { Loader2, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileInputProps {
    onFileSelected: (file: File) => void
    accept?: string
    disabled?: boolean
    loading?: boolean
    label?: string
    className?: string
}

const FileInput = ({
    onFileSelected,
    accept,
    disabled,
    loading,
    label = 'Selecionar arquivo',
    className
}: FileInputProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const arquivo = event.target.files?.[0]
        if (!arquivo) return
        onFileSelected(arquivo)
        event.target.value = ''
    }

    return (
        <div className={cn('w-full min-w-0', className)}>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                disabled={disabled || loading}
                onChange={handleChange}
                className="hidden"
            />
            <button
                type="button"
                disabled={disabled || loading}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    'flex w-full min-w-0 items-center justify-center gap-2 rounded-md border border-dashed border-input',
                    'bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors',
                    'hover:border-primary hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                )}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                ) : (
                    <Paperclip className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{label}</span>
            </button>
        </div>
    )
}

export { FileInput }
