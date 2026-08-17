CREATE TYPE "DestinatarioNotificacao" AS ENUM ('MASTER', 'IMOBILIARIA');

CREATE TYPE "TipoNotificacao" AS ENUM ('CONTESTACAO_ABERTA', 'DOCUMENTO_ENVIADO');

CREATE TABLE "notificacoes" (
    "id" SERIAL NOT NULL,
    "destinatario" "DestinatarioNotificacao" NOT NULL,
    "imobiliariaId" INTEGER,
    "contestacaoId" INTEGER NOT NULL,
    "tipo" "TipoNotificacao" NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "notificacoes_destinatario_imobiliariaId_idx" ON "notificacoes"("destinatario", "imobiliariaId");

CREATE INDEX "notificacoes_contestacaoId_idx" ON "notificacoes"("contestacaoId");

ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_imobiliariaId_fkey" FOREIGN KEY ("imobiliariaId") REFERENCES "imobiliarias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_contestacaoId_fkey" FOREIGN KEY ("contestacaoId") REFERENCES "contestacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
