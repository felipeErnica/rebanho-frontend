export type FarmInfo = {
    farmId: string
    farmName: string
    pasturesNumber: number
    animalsNumber: number
}

export type Farm = {
    id: string
    name: string
}

export type PastureInfo = {
    pastureName: string
    bullId?: string
    bullName?: string
    animalsNumber: number
}

export type Pasture = {
    id: string
    name: string
    bullId: string
    farmId: string
}
