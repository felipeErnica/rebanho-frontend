export type ReloadFunction = () => void

export const REQUIRED_FIELD_MSG = 'Este campo é obrigatório!'
export const LOADING_MSG = 'Carregando...'
export const NO_DATA_AVAILABLE = 'Não há dados disponíveis'

export type ColorStrings = 'warning' | 'error' | 'success' | 'info' 
| 'default' | 'primary'| 'secondary' 

export const ChipColorScheme: Map<string, ColorStrings> = new Map([
    ['FAILED', 'error'],
    ['SUCCESS', 'success'],
    ['STAND_BY', 'warning'],
])

