import type { IncomingMessage, ServerResponse } from 'http'
import { createApp } from '../src/main'

type ExpressHandler = (req: IncomingMessage, res: ServerResponse) => void

let handlerPromise: Promise<ExpressHandler> | null = null

async function buildHandler(): Promise<ExpressHandler> {
    const app = await createApp()
    await app.init()
    return app.getHttpAdapter().getInstance()
}

function getHandler(): Promise<ExpressHandler> {
    if (!handlerPromise) {
        handlerPromise = buildHandler()
    }
    return handlerPromise
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    const expressApp = await getHandler()
    expressApp(req, res)
}
