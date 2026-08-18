const ABAS_ABERTAS_KEY = 'risco-locaticio.abas-abertas'
const ABA_ID_KEY = 'risco-locaticio.aba-id'

function lerAbasAbertas(): string[] {
    try {
        return JSON.parse(localStorage.getItem(ABAS_ABERTAS_KEY) ?? '[]')
    } catch {
        return []
    }
}

function escreverAbasAbertas(abas: string[]) {
    localStorage.setItem(ABAS_ABERTAS_KEY, JSON.stringify(abas))
}

export function registrarAbaAberta(): { appEstavaFechado: boolean; abaId: string } {
    const abaJaExistente = sessionStorage.getItem(ABA_ID_KEY)
    const appEstavaFechado = lerAbasAbertas().length === 0 && !abaJaExistente

    const abaId = abaJaExistente ?? crypto.randomUUID()
    sessionStorage.setItem(ABA_ID_KEY, abaId)

    escreverAbasAbertas([...lerAbasAbertas().filter((id) => id !== abaId), abaId])

    return { appEstavaFechado, abaId }
}

export function encerrarAba(abaId: string): boolean {
    const abasRestantes = lerAbasAbertas().filter((id) => id !== abaId)
    escreverAbasAbertas(abasRestantes)
    return abasRestantes.length === 0
}
