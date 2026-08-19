import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { UsuarioFromJwtDto } from '../../../../modules/core/usuario/types/usuario-from-jwt.input'

@Injectable()
export class PapelAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const usuario: UsuarioFromJwtDto = request.user

        if (usuario?.role === 'MASTER') {
            return true
        }

        if (usuario?.papel !== 'ADMIN') {
            throw new ForbiddenException('Acesso restrito a administradores da imobiliária')
        }

        return true
    }
}
