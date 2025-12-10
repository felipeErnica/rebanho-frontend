import { TimerYesNoDialogProps, YesNoDialogProps } from "./dialog/DialogComponents"

export type ReloadFunction = () => void

export const REQUIRED_FIELD_MSG = 'Este campo é obrigatório!'
export const LOADING_MSG = 'Carregando...'
export const NO_DATA_AVAILABLE = 'Não há dados disponíveis'

export const GROUP_UPDATE_TITLE = 'ATENÇÃO: Atualização em conjunto!'
export const GROUP_DELETE_TITLE = 'ATENÇÃO: Exclusão de conjunto!'

export type ColorStrings = 'warning' | 'error' | 'success' | 'info' 
| 'default' | 'primary'| 'secondary' 

export const ChipColorScheme: Map<string, ColorStrings> = new Map([
    ['FAILED', 'error'],
    ['SUCCESS', 'success'],
    ['STAND_BY', 'warning'],
])


//Dialogo de Aviso.
export const DefaultWarning: YesNoDialogProps = {
    openYesNo: false,
    title: undefined,
    content: undefined,
    onClose: undefined,
    onYes: undefined
}

export const DefaultTimerWarning: TimerYesNoDialogProps = {
    openYesNo: false,
    waitTime: -1,
    title: undefined,
    content: undefined,
    onClose: undefined,
    onYes: undefined
}

//Tipo de Erros de API
export const ERROR_TYPE = "Error"
export const WARNING_TYPE = "Warning"

//Tipo de Erros
export const INTERNAL_SERVER_ERROR = "InternalError"
export const CONFLICT_ERROR = "ConflictError" 
export const INCORRET_INFO_ERROR = "IncorretInfoError"
export const OTHER_ERROR = "OtherError"


//Tipos de Aviso
export const CONFLICT_WARNING = "ConflictWarning"
export const TRANSFER_WARNING = "TransferWarning"
