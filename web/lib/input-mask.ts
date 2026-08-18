function cursorPositionAfterDigits(pattern: string, digitCount: number, formattedLength: number): number {
    if (digitCount <= 0) return 0

    let vistos = 0
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] !== '9') continue
        vistos++
        if (vistos !== digitCount) continue

        let fim = i + 1
        while (fim < pattern.length && pattern[fim] !== '9' && fim < formattedLength) fim++
        return Math.min(fim, formattedLength)
    }

    return formattedLength
}

export function applyMaskedChange(
    event: React.ChangeEvent<HTMLInputElement>,
    previousValue: string,
    pattern: string,
    maskFn: (value: string) => string
): void {
    const rawValue = event.target.value
    const cursorPos = event.target.selectionStart ?? rawValue.length

    let digits = rawValue.replace(/\D/g, '')
    let digitsBeforeCursor = rawValue.slice(0, cursorPos).replace(/\D/g, '').length

    const previousDigits = previousValue.replace(/\D/g, '')
    if (rawValue.length < previousValue.length && digits.length === previousDigits.length) {
        digits = digits.slice(0, -1)
        digitsBeforeCursor = Math.max(0, digitsBeforeCursor - 1)
    }

    const formatted = maskFn(digits)
    event.target.value = formatted

    const novaPosicao = cursorPositionAfterDigits(pattern, digitsBeforeCursor, formatted.length)
    event.target.setSelectionRange(novaPosicao, novaPosicao)
}
