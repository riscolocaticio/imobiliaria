CREATE TYPE "StatusContestacao" AS ENUM ('ABERTA', 'RESPONDIDA', 'PROCEDENTE', 'IMPROCEDENTE');

ALTER TYPE "AcaoAuditoria" ADD VALUE 'ABERTURA_CONTESTACAO';
ALTER TYPE "AcaoAuditoria" ADD VALUE 'ENVIO_DOCUMENTO_CONTESTACAO';
ALTER TYPE "AcaoAuditoria" ADD VALUE 'DECISAO_CONTESTACAO';

CREATE TABLE "contestacoes" (
    "id" SERIAL NOT NULL,
    "ocorrenciaId" INTEGER NOT NULL,
    "imobiliariaId" INTEGER NOT NULL,
    "motivoConsumidor" TEXT NOT NULL,
    "status" "StatusContestacao" NOT NULL DEFAULT 'ABERTA',
    "prazoLimite" TIMESTAMP(3) NOT NULL,
    "abertaPorUsuarioId" INTEGER NOT NULL,
    "respondidaEm" TIMESTAMP(3),
    "decisaoEm" TIMESTAMP(3),
    "decisaoObservacao" TEXT,
    "decididaPorUsuarioId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contestacoes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "contestacao_documentos" (
    "id" SERIAL NOT NULL,
    "contestacaoId" INTEGER NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "caminhoArquivo" TEXT NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "enviadoPorUsuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contestacao_documentos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "contestacoes_ocorrenciaId_idx" ON "contestacoes"("ocorrenciaId");

CREATE INDEX "contestacoes_imobiliariaId_idx" ON "contestacoes"("imobiliariaId");

CREATE INDEX "contestacao_documentos_contestacaoId_idx" ON "contestacao_documentos"("contestacaoId");

ALTER TABLE "contestacoes" ADD CONSTRAINT "contestacoes_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "ocorrencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "contestacoes" ADD CONSTRAINT "contestacoes_imobiliariaId_fkey" FOREIGN KEY ("imobiliariaId") REFERENCES "imobiliarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "contestacoes" ADD CONSTRAINT "contestacoes_abertaPorUsuarioId_fkey" FOREIGN KEY ("abertaPorUsuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "contestacoes" ADD CONSTRAINT "contestacoes_decididaPorUsuarioId_fkey" FOREIGN KEY ("decididaPorUsuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "contestacao_documentos" ADD CONSTRAINT "contestacao_documentos_contestacaoId_fkey" FOREIGN KEY ("contestacaoId") REFERENCES "contestacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "contestacao_documentos" ADD CONSTRAINT "contestacao_documentos_enviadoPorUsuarioId_fkey" FOREIGN KEY ("enviadoPorUsuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
