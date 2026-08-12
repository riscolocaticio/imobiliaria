import { Injectable, NotFoundException } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'

@Injectable()
export class ImobiliariaFindOwnUsecase {
    async execute(imobiliariaId: number) {
        const imobiliaria = await prisma.imobiliaria.findUnique({
            where: { id: imobiliariaId },
            select: {
                id: true,
                razaoSocial: true,
                nomeFantasia: true,
                cnpj: true,
                email: true,
                status: true,
                createdAt: true
            }
        })

        if (!imobiliaria) {
            throw new NotFoundException('Imobiliária não encontrada')
        }

        return imobiliaria
    }
}
