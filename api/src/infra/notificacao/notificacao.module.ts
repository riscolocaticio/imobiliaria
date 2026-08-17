import { Module } from '@nestjs/common'
import { NotificacaoService } from './notificacao.service'

@Module({
    providers: [NotificacaoService],
    exports: [NotificacaoService]
})
export class NotificacaoServiceModule {}
