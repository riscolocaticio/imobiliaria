import { Module } from '@nestjs/common'
import { LogListUsecase } from './log-list.usecase'

@Module({
    providers: [LogListUsecase],
    exports: [LogListUsecase]
})
export default class LogUsecasesModule {}
