import { Module } from '@nestjs/common'
import { NotificacaoController } from './notificacao.controller'
import NotificacaoUsecasesModule from './usecases/notificacao-usecases.module'

@Module({
    imports: [NotificacaoUsecasesModule],
    controllers: [NotificacaoController]
})
export default class NotificacaoModule {}
