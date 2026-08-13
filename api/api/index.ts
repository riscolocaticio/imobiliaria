import type { IncomingMessage, ServerResponse } from 'http'
import serverlessHttp from 'serverless-http'
import { createApp } from '../src/main'

type ServerlessHandler = (req: IncomingMessage, res: ServerResponse) => Promise<unknown>

let handlerPromise: Promise<ServerlessHandler> | null = null

async function buildHandler(): Promise<ServerlessHandler> {
    const app = await createApp()
    await app.init()
    return serverlessHttp(app.getHttpAdapter().getInstance()) as ServerlessHandler
}

function getHandler(): Promise<ServerlessHandler> {
    if (!handlerPromise) {
        handlerPromise = buildHandler()
    }
    return handlerPromise
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    const nestHandler = await getHandler()
    return nestHandler(req, res)
}
