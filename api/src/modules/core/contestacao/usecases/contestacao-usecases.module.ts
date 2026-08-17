import { Module } from '@nestjs/common'
import { AuditLogModule } from '../../../../infra/audit/audit-log.module'
import { NotificacaoServiceModule } from '../../../../infra/notificacao/notificacao.module'
import { ContestacaoAbrirUsecase } from './contestacao-abrir.usecase'
import { ContestacaoListarUsecase } from './contestacao-listar.usecase'
import { ContestacaoDetalharUsecase } from './contestacao-detalhar.usecase'
import { ContestacaoUploadDocumentoUsecase } from './contestacao-upload-documento.usecase'
import { ContestacaoDownloadDocumentoUsecase } from './contestacao-download-documento.usecase'
import { ContestacaoDecidirUsecase } from './contestacao-decidir.usecase'

@Module({
    imports: [AuditLogModule, NotificacaoServiceModule],
    providers: [
        ContestacaoAbrirUsecase,
        ContestacaoListarUsecase,
        ContestacaoDetalharUsecase,
        ContestacaoUploadDocumentoUsecase,
        ContestacaoDownloadDocumentoUsecase,
        ContestacaoDecidirUsecase
    ],
    exports: [
        ContestacaoAbrirUsecase,
        ContestacaoListarUsecase,
        ContestacaoDetalharUsecase,
        ContestacaoUploadDocumentoUsecase,
        ContestacaoDownloadDocumentoUsecase,
        ContestacaoDecidirUsecase
    ]
})
export default class ContestacaoUsecasesModule {}
