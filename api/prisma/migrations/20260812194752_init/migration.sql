-- CreateEnum
CREATE TYPE "StatusRegistro" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UsuarioRole" AS ENUM ('IMOBILIARIA', 'MASTER');

-- CreateEnum
CREATE TYPE "TipoOcorrencia" AS ENUM ('ABANDONO_IMOVEL', 'INADIMPLENCIA_LOCATICIA', 'DEPREDACAO_DANOS_IMOVEL', 'MULTA_CONTRATUAL', 'DESCUMPRIMENTO_CONTRATUAL', 'OUTROS');

-- CreateEnum
CREATE TYPE "StatusOcorrencia" AS ENUM ('ATIVA', 'EXCLUIDA');

-- CreateEnum
CREATE TYPE "AcaoAuditoria" AS ENUM ('LOGIN', 'CONSULTA_CPF', 'INSERCAO_OCORRENCIA', 'EXCLUSAO_OCORRENCIA');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "imobiliariaId" INTEGER NOT NULL,
    "acao" "AcaoAuditoria" NOT NULL,
    "cpfConsultado" TEXT,
    "ocorrenciaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imobiliarias" (
    "id" SERIAL NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "StatusRegistro" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imobiliarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocorrencias" (
    "id" SERIAL NOT NULL,
    "cpfInquilino" TEXT NOT NULL,
    "nomeInquilinoInformado" TEXT NOT NULL,
    "tipo" "TipoOcorrencia" NOT NULL,
    "descricao" TEXT NOT NULL,
    "imobiliariaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "status" "StatusOcorrencia" NOT NULL DEFAULT 'ATIVA',
    "excluidoEm" TIMESTAMP(3),
    "excluidoPorUsuarioId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ocorrencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "imobiliariaId" INTEGER NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UsuarioRole" NOT NULL DEFAULT 'IMOBILIARIA',
    "status" "StatusRegistro" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_usuarioId_idx" ON "audit_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "audit_logs_cpfConsultado_idx" ON "audit_logs"("cpfConsultado");

-- CreateIndex
CREATE UNIQUE INDEX "imobiliarias_cnpj_key" ON "imobiliarias"("cnpj");

-- CreateIndex
CREATE INDEX "ocorrencias_cpfInquilino_idx" ON "ocorrencias"("cpfInquilino");

-- CreateIndex
CREATE INDEX "ocorrencias_imobiliariaId_idx" ON "ocorrencias"("imobiliariaId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_login_key" ON "usuarios"("login");

-- CreateIndex
CREATE INDEX "usuarios_imobiliariaId_idx" ON "usuarios"("imobiliariaId");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_imobiliariaId_fkey" FOREIGN KEY ("imobiliariaId") REFERENCES "imobiliarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "ocorrencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_imobiliariaId_fkey" FOREIGN KEY ("imobiliariaId") REFERENCES "imobiliarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_excluidoPorUsuarioId_fkey" FOREIGN KEY ("excluidoPorUsuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_imobiliariaId_fkey" FOREIGN KEY ("imobiliariaId") REFERENCES "imobiliarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
