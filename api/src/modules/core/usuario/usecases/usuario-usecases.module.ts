import { Module } from '@nestjs/common'
import { AuditLogModule } from '../../../../infra/audit/audit-log.module'
import { CryptoService } from '../../../../infra/system/helpers/crypto/crypto.service'
import { UsuarioCreateUsecase } from './usuario-create.usecase'
import { UsuarioListByImobiliariaUsecase } from './usuario-list-by-imobiliaria.usecase'
import { UsuarioUpdateUsecase } from './usuario-update.usecase'

@Module({
    imports: [AuditLogModule],
    providers: [
        UsuarioCreateUsecase,
        UsuarioListByImobiliariaUsecase,
        UsuarioUpdateUsecase,
        CryptoService
    ],
    exports: [UsuarioCreateUsecase, UsuarioListByImobiliariaUsecase, UsuarioUpdateUsecase]
})
export default class UsuarioUsecasesModule {}
