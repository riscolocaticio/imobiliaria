import { Module } from '@nestjs/common'
import { AuditLogModule } from '../../../../infra/audit/audit-log.module'
import { ImobiliariaFindOwnUsecase } from './imobiliaria-find-own.usecase'
import { ImobiliariaListAllUsecase } from './imobiliaria-list-all.usecase'
import { ImobiliariaCreateUsecase } from './imobiliaria-create.usecase'
import { ImobiliariaUpdateUsecase } from './imobiliaria-update.usecase'

@Module({
    imports: [AuditLogModule],
    providers: [
        ImobiliariaFindOwnUsecase,
        ImobiliariaListAllUsecase,
        ImobiliariaCreateUsecase,
        ImobiliariaUpdateUsecase
    ],
    exports: [
        ImobiliariaFindOwnUsecase,
        ImobiliariaListAllUsecase,
        ImobiliariaCreateUsecase,
        ImobiliariaUpdateUsecase
    ]
})
export default class ImobiliariaUsecasesModule {}
