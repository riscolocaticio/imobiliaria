'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from './button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog'

export interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    onConfirm: () => void
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
}

const ConfirmDialog = ({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    confirmLabel = 'Sim',
    cancelLabel = 'Não',
    loading
}: ConfirmDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-8">
                <DialogHeader className="items-center gap-3 pr-0 text-center sm:items-start sm:text-left">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-7 w-7" />
                    </span>
                    <div className="flex flex-col gap-1.5">
                        <DialogTitle className="text-xl">{title}</DialogTitle>
                        {description && (
                            <DialogDescription className="text-sm leading-relaxed">
                                {description}
                            </DialogDescription>
                        )}
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-2 gap-2 sm:gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full sm:w-auto"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export { ConfirmDialog }
