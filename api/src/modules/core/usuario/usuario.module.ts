import { Module } from '@nestjs/common'
import { UsuarioController } from './usuario.controller'
import UsuarioUsecasesModule from './usecases/usuario-usecases.module'

@Module({
    imports: [UsuarioUsecasesModule],
    controllers: [UsuarioController]
})
export default class UsuarioModule {}
