import { ReactNode, useRef, useState } from "react";
import { TableTopBar } from "@/ui/shared/table/TableTopBar";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { TableCustom, TableProps } from "@/ui/shared/table/TableCustom";
import { IFilters } from "@/shared/interfaces/Filter";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { FilterPopover } from "./FilterPopover";

export type DisplayProps = {
    sortableColumns: ComboBoxItem[]
    filterPanel: ReactNode | ReactNode[]
    tableProps: TableProps
    order: string
    setOrder: (order: string) => void
    sort: string
    setSort: (sort: string) => void
    handleSubmit?: UseFormHandleSubmit<IFilters>
    setFilter?: (filter: IFilters) => void
    otherActions?: ReactNode | ReactNode[]
}

export type TableModelProps = {
    filter: IFilters
    sort: string
    order: string
}

export type OldFilterModelProps<T extends IFilters> = {
    control: Control<T>
}

export type FilterModelProps = {
    filter: IFilters
    setFilter: (filter: IFilters) => void
}

export const TableDisplay = (props: DisplayProps) => {

    const [isDrawerOpen, setOpenDrawer] = useState(false)
    const filterButtonRef = useRef<HTMLButtonElement>(null)

    return <div className="h-full overflow-hidden">
        <div className="h-full flex flex-col overflow-hidden">
            <TableTopBar
                buttonRef={filterButtonRef}
                sortableColumns={props.sortableColumns}
                setFilter={props.setFilter}
                order={props.order}
                sort={props.sort}
                setOrder={props.setOrder}
                setSort={props.setSort}
                isDrawerOpen={isDrawerOpen}
                setOpenDrawer={setOpenDrawer}
                otherActions={props.otherActions}
            />
            <TableCustom {...props.tableProps} />
        </div>
        <FilterPopover
            setOpen={setOpenDrawer}
            isOpen={isDrawerOpen}
            childPanel={props.filterPanel}
            setFilter={props.setFilter}
            anchorEl={filterButtonRef}
        />
    </div>
}
