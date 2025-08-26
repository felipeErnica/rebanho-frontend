export function trendingTransform(value: number) {
    const decimal = decimalTransform(value)
    return `${value > 0 ? '+' : ''}${decimal}%`
}

export function decimalTransform(value: number, digitNumbers?: number) {
    if (!value) return value.toString()
    const formatter = new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: digitNumbers || 2,
        minimumFractionDigits: digitNumbers || 2,
    })
    return formatter.format(value)
}

export function percentageTransform(value: number) {
    if (!value) return value.toString()
    const formatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 })
    return formatter.format(value) + '%'
}

export function dateTransform(value?: Date) {
    if (value === undefined) return ""
    value = new Date(value)
    const dateString = value.toLocaleDateString("pt-BR", { dateStyle: 'short' })
    if (dateString == 'Invalid Date') return ""
    return dateString
}
