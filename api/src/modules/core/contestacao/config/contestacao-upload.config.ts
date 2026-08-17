import { BadRequestException } from '@nestjs/common'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { diskStorage, FileFilterCallback } from 'multer'
import { Request } from 'express'

const TIPOS_PERMITIDOS = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const TAMANHO_MAXIMO_BYTES = 10 * 1024 * 1024

export const contestacaoUploadOptions = {
    storage: diskStorage({
        destination: (request: Request, _file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
            const contestacaoId = String(request.params.id)
            const destino = join(process.env.UPLOADS_DIR || './uploads', 'contestacoes', contestacaoId)
            if (!existsSync(destino)) {
                mkdirSync(destino, { recursive: true })
            }
            callback(null, destino)
        },
        filename: (_request: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
            const nomeSanitizado = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
            callback(null, `${Date.now()}-${nomeSanitizado}`)
        }
    }),
    fileFilter: (_request: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
        if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
            callback(new BadRequestException('Tipo de arquivo não permitido. Envie PDF, imagem ou documento do Word.'))
            return
        }
        callback(null, true)
    },
    limits: { fileSize: TAMANHO_MAXIMO_BYTES }
}
