import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { UsuarioFromJwtDto } from '../../../../modules/core/usuario/types/usuario-from-jwt.input'

@Injectable()
export class MasterGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const usuario: UsuarioFromJwtDto = request.user

        if (usuario?.role !== 'MASTER') {
            throw new ForbiddenException('Acesso restrito ao administrador da plataforma')
        }

        return true
    }
}
