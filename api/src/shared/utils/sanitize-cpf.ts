export function sanitizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '')
}
