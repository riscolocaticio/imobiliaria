import * as dotenv from 'dotenv'
import { defineConfig, env } from 'prisma/config'

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })
dotenv.config({ path: '.env' })

export default defineConfig({
    schema: 'prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'ts-node prisma/seed.ts'
    },
    datasource: {
        url: env('DATABASE_URL')
    }
})
