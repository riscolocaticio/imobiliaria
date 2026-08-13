export function sanitizeCnpj(cnpj: string): string {
    return cnpj.replace(/\D/g, '')
}
