'use client'

import { Loader2 } from 'lucide-react'
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
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export { ConfirmDialog }
