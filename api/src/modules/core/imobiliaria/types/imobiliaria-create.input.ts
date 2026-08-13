import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ImobiliariaCreateInput {
    @IsString()
    @IsNotEmpty({ message: 'A razão social é obrigatória' })
    razaoSocial: string

    @IsString()
    @IsOptional()
    nomeFantasia?: string

    @IsString()
    @IsNotEmpty({ message: 'O CNPJ é obrigatório' })
    cnpj: string

    @IsEmail({}, { message: 'E-mail inválido' })
    email: string
}
