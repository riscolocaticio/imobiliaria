import { Injectable } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'

@Injectable()
export class AuthLogoutUsecase {
    async execute(usuarioId: number): Promise<void> {
        await prisma.usuario.update({
            where: { id: usuarioId },
            data: { sessaoExpiraEm: null }
        })
    }
}
