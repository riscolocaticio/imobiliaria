'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row gap-2',
                month: 'flex flex-col gap-3',
                caption: 'flex justify-center pt-1 relative items-center w-full',
                caption_label: 'text-sm font-semibold',
                caption_dropdowns: 'flex items-center justify-center gap-2',
                vhidden: 'sr-only',
                dropdown_month:
                    'relative inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-ring',
                dropdown_year:
                    'relative inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-ring',
                dropdown: 'absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none opacity-0',
                dropdown_icon: 'h-3.5 w-3.5 opacity-60',
                nav: 'flex items-center gap-1',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 absolute'
                ),
                nav_button_previous: 'left-1',
                nav_button_next: 'right-1',
                table: 'w-full border-collapse',
                head_row: 'flex',
                head_cell: 'text-muted-foreground w-9 font-medium text-xs uppercase tracking-wide',
                row: 'flex w-full mt-1.5',
                cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9 rounded-full p-0 font-normal aria-selected:opacity-100'
                ),
                day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'ring-2 ring-primary/50 font-semibold',
                day_outside: 'text-muted-foreground opacity-50',
                day_disabled: 'text-muted-foreground opacity-40',
                day_hidden: 'invisible',
                ...classNames
            }}
            components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />
            }}
            {...props}
        />
    )
}
Calendar.displayName = 'Calendar'

export { Calendar }
