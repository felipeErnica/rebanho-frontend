export function positiveTransform(value: number) {
    return `${value > 0 ? '+' : ''}${value}`
}

export function trendingTransform(value: number) {
    const decimal = percentageTransform(value)
    return `${value > 0 ? '+' : ''}${decimal}`
}

export function decimalTransform(value: any, digitNumbers?: number) {
    if (value === null || !value) return "0"
    const formatter = new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: digitNumbers || 2,
        minimumFractionDigits: digitNumbers || 2,
    })
    return formatter.format(value as number)
}

export function percentageTransform(value: number | null | undefined) {
    if (value === null || !value) return "0%"
    const formatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 })
    return formatter.format(value) + '%'
}

export function dateTransform(value: Date | undefined, options?: Intl.DateTimeFormatOptions) {
    if (value === undefined) return ""
    if (!value) return ""
    value = new Date(value)
    const dateString = value.toLocaleDateString("pt-BR", options ?? { dateStyle: 'short' })
    if (dateString == 'Invalid Date') return ""
    return dateString
}

export function dateToISO(value: Date | undefined) {
    if (value === undefined) return ""
    if (!value) return ""
    value = new Date(value)
    return value.toISOString()
}

export function transformWeight(weight: number | undefined) {
    if (!weight) return "0 (0@)"
    return `${decimalTransform(weight)} (${decimalTransform(weight / 15)}@)`
}

