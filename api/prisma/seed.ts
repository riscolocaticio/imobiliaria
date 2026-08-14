import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`) })

import * as bcrypt from 'bcryptjs'
import prisma from '../src/infra/persistence/prisma'

async function main() {
    const imobiliaria = await prisma.imobiliaria.upsert({
        where: { cnpj: '00000000000191' },
        update: {},
        create: {
            razaoSocial: 'Imobiliária Exemplo LTDA',
            nomeFantasia: 'Imobiliária Exemplo',
            cnpj: '00000000000191',
            email: 'contato@imobiliariaexemplo.com.br'
        }
    })

    const passwordHash = await bcrypt.hash('senha123', 10)

    await prisma.usuario.upsert({
        where: { login: 'admin' },
        update: {},
        create: {
            imobiliariaId: imobiliaria.id,
            nomeCompleto: 'Usuário Administrador',
            cpf: '00000000000',
            dataNascimento: new Date('1990-01-01'),
            email: 'admin@imobiliariaexemplo.com.br',
            login: 'admin',
            passwordHash,
            role: 'IMOBILIARIA'
        }
    })

    const plataforma = await prisma.imobiliaria.upsert({
        where: { cnpj: '00000000000272' },
        update: {},
        create: {
            razaoSocial: 'Administração da Plataforma',
            nomeFantasia: 'Safeloc',
            cnpj: '00000000000272',
            email: 'admin@plataformariscolocaticio.com.br'
        }
    })

    const masterPasswordHash = await bcrypt.hash('Master@#Risco2026', 10)

    await prisma.usuario.upsert({
        where: { login: 'master' },
        update: {},
        create: {
            imobiliariaId: plataforma.id,
            nomeCompleto: 'Administrador da Plataforma',
            cpf: '00000000099',
            dataNascimento: new Date('1990-01-01'),
            email: 'master@plataformariscolocaticio.com.br',
            login: 'master',
            passwordHash: masterPasswordHash,
            role: 'MASTER'
        }
    })

    console.log('Seed concluído: imobiliária "Imobiliária Exemplo" e usuário "admin" / "senha123"')
    console.log('Seed concluído: usuário master "master" / "Master@#Risco2026"')
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
