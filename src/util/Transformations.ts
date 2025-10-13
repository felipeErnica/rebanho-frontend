export function positiveTransform(value: number) {
    return `${value > 0 ? '+' : ''}${value}`
}

export function trendingTransform(value: number) {
    const decimal = percentageTransform(value)
    return `${value > 0 ? '+' : ''}${decimal}`
}

export function decimalTransform(value: any, digitNumbers?: number) {
    if (value === null) return "0"
    if (!value) return value.toString()
    const formatter = new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: digitNumbers || 2,
        minimumFractionDigits: digitNumbers || 2,
    })
    return formatter.format(value as number)
}

export function percentageTransform(value: number | null) {
    if (value === null) return "0%"
    if (!value) return value.toString()
    const formatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 })
    return formatter.format(value) + '%'
}

export function dateTransform(value?: Date) {
    if (value === undefined) return ""
    if (!value) return ""
    value = new Date(value)
    const dateString = value.toLocaleDateString("pt-BR", { dateStyle: 'short' })
    if (dateString == 'Invalid Date') return ""
    return dateString
}
