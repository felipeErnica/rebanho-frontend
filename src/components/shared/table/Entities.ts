import { Dispatch, SetStateAction } from "react"

export type EditRowProps<T> = {
    setEditing: Dispatch<SetStateAction<boolean>>
    setRowData: Dispatch<SetStateAction<T>>
    rowData: T
}

export type NormalRow<T> = {
    setEditing: Dispatch<SetStateAction<boolean>>
    row: T
}

export type TableRowProp<T> = {
    onDelete?: (id: string) => void
    loading?: boolean
    row: T
}
