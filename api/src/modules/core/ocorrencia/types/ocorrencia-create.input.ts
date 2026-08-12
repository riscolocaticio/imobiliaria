import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { TipoOcorrencia } from '@prisma/client'

export class OcorrenciaCreateInput {
    @IsString()
    @IsNotEmpty({ message: 'O nome completo do inquilino é obrigatório' })
    nomeInquilinoInformado: string

    @IsString()
    @IsNotEmpty({ message: 'O CPF é obrigatório' })
    cpfInquilino: string

    @IsEnum(TipoOcorrencia, { message: 'Tipo de ocorrência inválido' })
    tipo: TipoOcorrencia

    @IsString()
    @IsNotEmpty({ message: 'A descrição da ocorrência é obrigatória' })
    @MaxLength(1000, { message: 'A descrição deve ter no máximo 1000 caracteres' })
    descricao: string
}
