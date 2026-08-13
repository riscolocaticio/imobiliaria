export function formatCnpj(cnpj: string): string {
    const digits = cnpj.replace(/\D/g, '').padEnd(14, ' ').slice(0, 14)
    if (digits.trim().length < 14) return cnpj
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export function maskCnpjInput(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 14)

    if (digits.length > 12) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5')
    if (digits.length > 8) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4')
    if (digits.length > 5) return digits.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3')
    if (digits.length > 2) return digits.replace(/(\d{2})(\d{1,3})/, '$1.$2')
    return digits
}

export function isCnpjComplete(value: string): boolean {
    return value.replace(/\D/g, '').length === 14
}
