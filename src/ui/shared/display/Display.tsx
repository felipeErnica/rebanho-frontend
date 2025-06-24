import { JSX, ReactNode, useState } from "react";
import { TableTopBar } from "@/ui/shared/table/TableTopBar";
import { FilterDrawer } from "@/ui/shared/common/FilterDrawer";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { TableCustom, TableProps } from "@/ui/shared/table/Table";
import { IFilters } from "@/shared/interfaces/Filter";

export type DisplayProps = {
    sortableColumns: ComboBoxItem[]
    filterPanel: ReactNode | ReactNode[]
    tableProps: TableProps
    order: string
    setOrder: (order: string) => void
    sort: string
    setSort: (sort: string) => void
}

export type TableModelProps = {
    filter: IFilters
    sort: string
    order: string
}

export type FilterModelProps = {
    filter: IFilters
    setFilter: (filter: IFilters) => void
}

export const TableDisplay = (props: DisplayProps): JSX.Element => {
    const [isDrawerOpen, setOpenDrawer] = useState(false)

    return <div className="h-full grid grid-cols-[1fr_auto] overflow-hidden">
        <div className="h-full grid grid-rows-[auto_1fr] overflow-hidden">
            <TableTopBar
                sortableColumns={props.sortableColumns}
                order={props.order}
                sort={props.sort}
                setOrder={props.setOrder}
                setSort={props.setSort}
                isDrawerOpen={isDrawerOpen}
                setOpenDrawer={setOpenDrawer}
            />
            <TableCustom {...props.tableProps} />
        </div>
        <FilterDrawer
            childPanel={props.filterPanel}
            isOpen={isDrawerOpen} setOpen={setOpenDrawer}
        />
    </div>
}
