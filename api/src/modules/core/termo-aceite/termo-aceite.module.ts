import { Module } from '@nestjs/common'
import { TermoAceiteController } from './termo-aceite.controller'
import TermoAceiteUsecasesModule from './usecases/termo-aceite-usecases.module'

@Module({
    imports: [TermoAceiteUsecasesModule],
    controllers: [TermoAceiteController]
})
export default class TermoAceiteModule {}
