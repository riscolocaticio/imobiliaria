import { Module } from '@nestjs/common'
import { ImobiliariaController } from './imobiliaria.controller'
import ImobiliariaUsecasesModule from './usecases/imobiliaria-usecases.module'

@Module({
    imports: [ImobiliariaUsecasesModule],
    controllers: [ImobiliariaController]
})
export default class ImobiliariaModule {}
