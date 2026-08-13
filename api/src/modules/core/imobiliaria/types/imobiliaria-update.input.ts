import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator'

export class ImobiliariaUpdateInput {
    @IsString()
    @IsOptional()
    razaoSocial?: string

    @IsString()
    @IsOptional()
    nomeFantasia?: string

    @IsEmail({}, { message: 'E-mail inválido' })
    @IsOptional()
    email?: string

    @IsIn(['ATIVO', 'INATIVO'])
    @IsOptional()
    status?: 'ATIVO' | 'INATIVO'
}
