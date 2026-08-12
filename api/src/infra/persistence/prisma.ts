import * as dotenv from 'dotenv'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const envFile = `.env.${process.env.NODE_ENV || 'development'}`
const envPath = path.resolve(process.cwd(), envFile)

dotenv.config({ path: envPath })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error(
        `DATABASE_URL is not defined. Tried loading: ${envPath} and .env (cwd: ${process.cwd()})`
    )
}

const adapter = new PrismaPg({ connectionString })

const prismaClientSingleton = () => new PrismaClient({ adapter })

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}

export default prisma
