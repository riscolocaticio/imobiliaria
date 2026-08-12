import { IsDateString, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

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
}
