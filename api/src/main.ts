import { ValidationPipe, INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './infra/system/security/global-exceptions-filters'

export async function createApp(): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule)

    app.getHttpAdapter().getInstance().set('trust proxy', 1)

    app.use(
        helmet({
            contentSecurityPolicy: false
        })
    )

    app.enableCors({
        origin: [process.env.URL_FRONT_END],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        exposedHeaders: ['Authorization'],
        maxAge: 60 * 60 * 24
    })

    app.useGlobalFilters(new GlobalExceptionFilter())
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true }
        })
    )

    if (process.env.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('Safeloc API')
            .setDescription('Documentação da API')
            .setVersion('1.0')
            .addBearerAuth()
            .build()
        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('api-docs', app, document)
    }

    return app
}

async function bootstrap() {
    const app = await createApp()
    await app.listen(process.env.PORT)
}

if (require.main === module) {
    bootstrap()
}
