import { format, getDaysInMonth, isValid, parse, parseISO } from 'date-fns'

const DISPLAY_FORMAT = 'dd/MM/yyyy'
const ISO_FORMAT = 'yyyy-MM-dd'

export function maskDateInput(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 8)

    let dia = digits.slice(0, 2)
    let mes = digits.slice(2, 4)
    const ano = digits.slice(4, 8)

    if (dia.length === 2) {
        const diaNum = Number(dia)
        if (diaNum === 0) dia = '01'
        else if (diaNum > 31) dia = '31'
    }

    if (mes.length === 2) {
        const mesNum = Number(mes)
        if (mesNum === 0) mes = '01'
        else if (mesNum > 12) mes = '12'
    }

    if (dia.length === 2 && mes.length === 2 && ano.length === 4) {
        const ultimoDiaDoMes = getDaysInMonth(new Date(Number(ano), Number(mes) - 1))
        if (Number(dia) > ultimoDiaDoMes) dia = String(ultimoDiaDoMes).padStart(2, '0')
    }

    let resultado = dia
    if (mes) resultado += `/${mes}`
    if (ano) resultado += `/${ano}`
    return resultado
}

export function isDateInputComplete(value: string): boolean {
    return value.length === 10 && isValid(parse(value, DISPLAY_FORMAT, new Date()))
}

export function dateInputToIso(value: string): string {
    if (!isDateInputComplete(value)) return ''
    return format(parse(value, DISPLAY_FORMAT, new Date()), ISO_FORMAT)
}

export function isoToDateInput(value: string): string {
    if (!value) return ''
    const parsed = parseISO(value)
    return isValid(parsed) ? format(parsed, DISPLAY_FORMAT) : ''
}
