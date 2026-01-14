import { ReactNode, useRef, useState } from "react";
import { TableTopBarOld } from "@shared/table/TableTopBar";
import { ComboBoxItem } from "@shared/common/ComboBox";
import { TableCustom, TableProps } from "@shared/table/TableCustom";
import { IFilters } from "@utils/Filter";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { FilterPopover } from "@shared/filter-controls/FilterPopover";

export type DisplayProps = {
    sortableColumns: ComboBoxItem[]
    filterPanel: ReactNode | ReactNode[]
    tableProps: TableProps
    order: string
    setOrder: (order: string) => void
    sort: string
    setSort: (sort: string) => void
    handleSubmit?: UseFormHandleSubmit<IFilters>
    setFilter: (filter: IFilters) => void
    otherButtons?: ReactNode | ReactNode[]
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
            <TableTopBarOld
                buttonRef={filterButtonRef}
                sortableColumns={props.sortableColumns}
                setFilter={props.setFilter}
                order={props.order}
                sort={props.sort}
                setOrder={props.setOrder}
                setSort={props.setSort}
                isDrawerOpen={isDrawerOpen}
                setOpenDrawer={setOpenDrawer}
                otherActions={props.otherButtons}
            />
            <TableCustom {...props.tableProps} />
        </div>
        <FilterPopover
            setFilterOpen={setOpenDrawer}
            filterOpen={isDrawerOpen}
            children={props.filterPanel}
            onReload={props.setFilter}
            anchorEl={filterButtonRef}
        />
    </div>
}
