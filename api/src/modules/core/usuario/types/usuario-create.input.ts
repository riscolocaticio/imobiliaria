import { IsDateString, IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class UsuarioCreateInput {
    @IsString()
    @IsNotEmpty({ message: 'O nome completo é obrigatório' })
    nomeCompleto: string

    @IsString()
    @IsNotEmpty({ message: 'O CPF é obrigatório' })
    cpf: string

    @IsDateString({}, { message: 'Data de nascimento inválida' })
    dataNascimento: string

    @IsEmail({}, { message: 'E-mail inválido' })
    email: string

    @IsString()
    @IsNotEmpty({ message: 'O login é obrigatório' })
    login: string

    @IsString()
    @MinLength(6, { message: 'A senha deve ter ao menos 6 caracteres' })
    password: string

    // Se não informado, o usuário é criado como ADMIN (comportamento anterior).
    @IsIn(['ADMIN', 'PADRAO'])
    @IsOptional()
    papel?: 'ADMIN' | 'PADRAO'

    // Só é considerado quando quem está criando é MASTER — para os demais, o
    // usuário é sempre criado na própria imobiliária, ignorando este campo.
    @IsInt()
    @IsOptional()
    imobiliariaId?: number
}
