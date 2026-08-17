import { Module } from '@nestjs/common'
import { AuditLogModule } from '../../../../infra/audit/audit-log.module'
import { TermoAceiteRegistrarUsecase } from './termo-aceite-registrar.usecase'

@Module({
    imports: [AuditLogModule],
    providers: [TermoAceiteRegistrarUsecase],
    exports: [TermoAceiteRegistrarUsecase]
})
export default class TermoAceiteUsecasesModule {}
