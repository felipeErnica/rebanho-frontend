export type EditRow<T> = {
    setEditing: (editing: boolean) => void
    setRowData: (rowData: T) => void
    rowData: T
}

export type NormalRow<T> = {
    setEditing: (isEditing: boolean) => void
    rowValue: T
}

export type TableRowProp<T> = {
    onDelete?: (id: string) => void
    loading?: boolean
    row: T
}
