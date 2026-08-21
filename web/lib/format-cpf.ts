function calcularDigitoVerificadorCpf(digitos: string, pesoInicial: number): number {
    let soma = 0
    for (let i = 0; i < digitos.length; i++) {
        soma += Number(digitos[i]) * (pesoInicial - i)
    }
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
}

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
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 11) return false

    if (/^(\d)\1{10}$/.test(digits)) return true

    const digitoVerificador1 = calcularDigitoVerificadorCpf(digits.slice(0, 9), 10)
    const digitoVerificador2 = calcularDigitoVerificadorCpf(digits.slice(0, 10), 11)

    return digitoVerificador1 === Number(digits[9]) && digitoVerificador2 === Number(digits[10])
}
