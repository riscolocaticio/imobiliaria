-- AlterEnum
BEGIN;
CREATE TYPE "TipoOcorrencia_new" AS ENUM ('ABANDONO_IMOVEL', 'ACAO_JUDICIAL', 'CONDOMINIO', 'DANOS_MOBILIA', 'DANOS_IMOVEL', 'DEBITO_ALUGUEL', 'DESCUMPRIMENTO_CONTRATUAL', 'LUZ_AGUA_IPTU', 'MULTA_RESCISORIA_NAO_QUITADA', 'PINTURA');
ALTER TABLE "ocorrencias" ALTER COLUMN "tipo" TYPE "TipoOcorrencia_new" USING ("tipo"::text::"TipoOcorrencia_new");
ALTER TYPE "TipoOcorrencia" RENAME TO "TipoOcorrencia_old";
ALTER TYPE "TipoOcorrencia_new" RENAME TO "TipoOcorrencia";
DROP TYPE "public"."TipoOcorrencia_old";
COMMIT;
