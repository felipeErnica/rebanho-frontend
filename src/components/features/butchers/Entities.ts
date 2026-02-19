export type Butcher = {
    id: string
    name: string
    cnpj?: string
    address?: string
    discount?: number
    animalsNumber: number
    averageWeight: number
    averageRate: number
};

export type ButcherSave = {
    id: string
    name: string
    cnpj?: string
    address?: string
    discount?: number
    ignoreAddress: boolean
};

export type ButcherDelete = {
    id: string
    override: boolean
    ignoreDeaths: boolean
}
