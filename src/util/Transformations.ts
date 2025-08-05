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

export const dateTransformToLocale = (value?: string) => {
    if (!value) return value
    const date = new Date(value)
    return date.toLocaleDateString("pt-BR", { dateStyle: 'short' })
}
