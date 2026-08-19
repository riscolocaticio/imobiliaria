-- CreateEnum
CREATE TYPE "PapelUsuario" AS ENUM ('ADMIN', 'PADRAO');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "papel" "PapelUsuario" NOT NULL DEFAULT 'ADMIN';
