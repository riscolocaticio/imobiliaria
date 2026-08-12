import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse()

        if (exception instanceof HttpException) {
            return response.status(exception.getStatus()).json(exception.getResponse())
        }

        this.logger.error(exception)

        return response.status(500).json({
            message: 'Erro interno do servidor'
        })
    }
}
