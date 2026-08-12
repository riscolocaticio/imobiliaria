import { IsNotEmpty, IsString } from 'class-validator'

export class AuthLoginInput {
    @IsString()
    @IsNotEmpty({ message: 'O login é obrigatório' })
    login: string

    @IsString()
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    password: string
}
