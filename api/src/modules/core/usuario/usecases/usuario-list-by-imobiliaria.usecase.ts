import { Injectable } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'

@Injectable()
export class UsuarioListByImobiliariaUsecase {
    async execute(imobiliariaId: number) {
        return prisma.usuario.findMany({
            where: { imobiliariaId },
            select: {
                id: true,
                nomeCompleto: true,
                cpf: true,
                dataNascimento: true,
                email: true,
                login: true,
                role: true,
                status: true,
                createdAt: true
            },
            orderBy: { createdAt: 'asc' }
        })
    }
}
