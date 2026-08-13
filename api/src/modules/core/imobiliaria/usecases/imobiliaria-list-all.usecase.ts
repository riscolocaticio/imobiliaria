import { Injectable } from '@nestjs/common'
import prisma from '../../../../infra/persistence/prisma'

@Injectable()
export class ImobiliariaListAllUsecase {
    async execute() {
        return prisma.imobiliaria.findMany({
            select: {
                id: true,
                razaoSocial: true,
                nomeFantasia: true,
                cnpj: true,
                email: true,
                status: true,
                createdAt: true,
                _count: { select: { usuarios: true } }
            },
            orderBy: { razaoSocial: 'asc' }
        })
    }
}
