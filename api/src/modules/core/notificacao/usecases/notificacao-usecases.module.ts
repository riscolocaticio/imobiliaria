import { Module } from '@nestjs/common'
import { NotificacaoListarUsecase } from './notificacao-listar.usecase'
import { NotificacaoMarcarLidaUsecase } from './notificacao-marcar-lida.usecase'
import { NotificacaoMarcarTodasLidasUsecase } from './notificacao-marcar-todas-lidas.usecase'

@Module({
    providers: [NotificacaoListarUsecase, NotificacaoMarcarLidaUsecase, NotificacaoMarcarTodasLidasUsecase],
    exports: [NotificacaoListarUsecase, NotificacaoMarcarLidaUsecase, NotificacaoMarcarTodasLidasUsecase]
})
export default class NotificacaoUsecasesModule {}
