import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UsuarioFromJwtDto } from '../../../../modules/core/usuario/types/usuario-from-jwt.input'

export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): UsuarioFromJwtDto => {
        const request = ctx.switchToHttp().getRequest()
        return request.user
    }
)
