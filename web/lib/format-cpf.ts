export function formatCpf(cpf: string): string {
    const digits = cpf.replace(/\D/g, '').padEnd(11, ' ').slice(0, 11)
    if (digits.trim().length < 11) return cpf
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
