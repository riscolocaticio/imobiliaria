import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator'

export class UsuarioUpdateInput {
    @IsString()
    @IsOptional()
    nomeCompleto?: string

    @IsEmail({}, { message: 'E-mail inválido' })
    @IsOptional()
    email?: string

    @IsString()
    @MinLength(6, { message: 'A senha deve ter ao menos 6 caracteres' })
    @IsOptional()
    password?: string

    @IsIn(['ATIVO', 'INATIVO'])
    @IsOptional()
    status?: 'ATIVO' | 'INATIVO'
}
