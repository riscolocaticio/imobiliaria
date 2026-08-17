export function addBusinessDays(date: Date, dias: number): Date {
    const resultado = new Date(date)
    let diasAdicionados = 0

    while (diasAdicionados < dias) {
        resultado.setDate(resultado.getDate() + 1)
        const diaDaSemana = resultado.getDay()
        if (diaDaSemana !== 0 && diaDaSemana !== 6) {
            diasAdicionados++
        }
    }

    return resultado
}
