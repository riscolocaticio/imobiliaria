import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator'

export class ContestacaoDecidirInput {
    @IsIn(['PROCEDENTE', 'IMPROCEDENTE'], { message: 'Decisão inválida' })
    decisao: 'PROCEDENTE' | 'IMPROCEDENTE'

    @IsOptional()
    @IsString()
    @MaxLength(1000, { message: 'A observação deve ter no máximo 1000 caracteres' })
    observacao?: string
}
