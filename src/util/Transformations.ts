export function trendingTransform(value: number) {
    const decimal = decimalTransform(value)
    return `${value > 0 ? '+' : ''}${decimal}%`
}

export const decimalTransform = (value: number) => {
    if (!value) return value.toString()
    const formatter = new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    })
    return formatter.format(value)
}

export const percentageTransform = (value: number) => {
    if (!value) return value.toString()
    const formatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 })
    return formatter.format(value) + '%'
}

export const dateTransform = (value?: Date) => {
    if (value === undefined) return ""
    value = new Date(value)
    const dateString = value.toLocaleDateString("pt-BR", { dateStyle: 'short' })
    if (dateString == 'Invalid Date') return ""
    return dateString
}
