export type Farm = {
    id: string
    name: string
    taxNumber: string
}

export type Pasture = {
    id: string
    bullId: string
    bullName: string
    name: string
    farmId: string
    farmName: string
}
