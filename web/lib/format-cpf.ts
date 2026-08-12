export function formatCpf(cpf: string): string {
    const digits = cpf.replace(/\D/g, '').padEnd(11, ' ').slice(0, 11)
    if (digits.trim().length < 11) return cpf
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function maskCpfInput(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11)

    if (digits.length > 9) return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
    if (digits.length > 6) return digits.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
    if (digits.length > 3) return digits.replace(/(\d{3})(\d{1,3})/, '$1.$2')
    return digits
}

export function isCpfComplete(value: string): boolean {
    return value.replace(/\D/g, '').length === 11
}
