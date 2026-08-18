function calcularDigitoVerificadorCnpj(digitos: string): number {
    const pesos = digitos.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const soma = digitos.split('').reduce((acc, digito, i) => acc + Number(digito) * pesos[i], 0)
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
}

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
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 14) return false
    if (/^(\d)\1{13}$/.test(digits)) return false

    const digitoVerificador1 = calcularDigitoVerificadorCnpj(digits.slice(0, 12))
    const digitoVerificador2 = calcularDigitoVerificadorCnpj(digits.slice(0, 13))

    return digitoVerificador1 === Number(digits[12]) && digitoVerificador2 === Number(digits[13])
}
