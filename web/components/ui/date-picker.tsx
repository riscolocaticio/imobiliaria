'use client'

import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface DatePickerProps {
    id?: string
    value?: string
    onChange: (value: string) => void
    placeholder?: string
}

export function DatePicker({ id, value, onChange, placeholder = 'Selecione a data' }: DatePickerProps) {
    const selected = value ? parseISO(value) : undefined

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    className={cn(
                        'w-full justify-start gap-2 text-left font-normal',
                        !selected && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="h-4 w-4 shrink-0" />
                    {selected ? format(selected, 'dd/MM/yyyy', { locale: ptBR }) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={(date) => date && onChange(format(date, 'yyyy-MM-dd'))}
                    disabled={{ after: new Date() }}
                    captionLayout="dropdown"
                    fromYear={1930}
                    toYear={new Date().getFullYear()}
                    locale={ptBR}
                />
            </PopoverContent>
        </Popover>
    )
}
