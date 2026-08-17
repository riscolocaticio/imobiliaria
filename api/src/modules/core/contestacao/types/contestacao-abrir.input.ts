import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class ContestacaoAbrirInput {
    @IsInt({ message: 'Informe uma ocorrência válida' })
    ocorrenciaId: number

    @IsString()
    @IsNotEmpty({ message: 'Descreva o motivo relatado pelo consumidor' })
    @MaxLength(1000, { message: 'O motivo deve ter no máximo 1000 caracteres' })
    motivoConsumidor: string
}
