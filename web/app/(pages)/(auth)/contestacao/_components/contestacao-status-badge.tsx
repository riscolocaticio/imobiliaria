import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { STATUS_CONTESTACAO_BADGE_CLASSNAME, STATUS_CONTESTACAO_LABEL, StatusContestacao } from '@/shared/constants/status-contestacao'

export function ContestacaoStatusBadge({ status, className }: { status: StatusContestacao; className?: string }) {
    return (
        <Badge variant="outline" className={cn(STATUS_CONTESTACAO_BADGE_CLASSNAME[status], className)}>
            {STATUS_CONTESTACAO_LABEL[status]}
        </Badge>
    )
}
