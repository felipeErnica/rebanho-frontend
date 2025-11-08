import { APIError } from "@/util/ApiRequest"

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

//Manejo de Erros

export const INTERNAL_SERVER_ERROR = "InternalError"
export const CONFLICT_ERROR = "ConflictError" 
export const INCORRET_INFO_ERROR = "IncorretInfoError"
export const OTHER_ERROR = "OtherError"
export const API_WARNING = "ApiWarning"

export const CONNECTION_ERROR: APIError = {
    kind: 'ConnectionError',
    title: 'Erro de Conexão',
    message: 'Não foi possível conectar com o servidor!'
}

