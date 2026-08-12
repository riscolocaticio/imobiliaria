import { Module } from '@nestjs/common'
import { ImobiliariaFindOwnUsecase } from './imobiliaria-find-own.usecase'

@Module({
    providers: [ImobiliariaFindOwnUsecase],
    exports: [ImobiliariaFindOwnUsecase]
})
export default class ImobiliariaUsecasesModule {}
