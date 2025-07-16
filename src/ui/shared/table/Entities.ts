export type EditRow<T> = {
    setEditing: (isEditing: boolean) => void
    setRowValue: (rowValue: T) => void
    rowValue: T
}

export type NormalRow<T> = {
    setEditing: (isEditing: boolean) => void
    rowValue: T
}
