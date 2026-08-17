ALTER TYPE "AcaoAuditoria" ADD VALUE 'ACEITE_TERMO_USO';

CREATE TABLE "termos_aceite" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "aceitoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,

    CONSTRAINT "termos_aceite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "termos_aceite_usuarioId_key" ON "termos_aceite"("usuarioId");

ALTER TABLE "termos_aceite" ADD CONSTRAINT "termos_aceite_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
