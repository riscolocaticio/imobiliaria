import { Module } from '@nestjs/common'
import { LogController } from './log.controller'
import LogUsecasesModule from './usecases/log-usecases.module'

@Module({
    imports: [LogUsecasesModule],
    controllers: [LogController]
})
export default class LogModule {}
