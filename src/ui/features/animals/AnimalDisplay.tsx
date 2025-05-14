import { JSX, useState } from "react";
import { AnimalFilter } from "@/types/Animal";
import { TableTopBar } from "@/ui/components/table/TableTopBar";
import { FilterDrawer } from "@/ui/components/common/Drawer";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { AnimalFilterElement } from "./AnimalFilter";
import { TableAnimal } from "./TableAnimal";

export const AnimalDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<AnimalFilter>({isFiltered: false})
    const [isDrawerOpen, setOpenDrawer] = useState(false)
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('name')

    const sortableColumns: ComboBoxItem[] = [
        {name: "Nome", value: "name"},
        {name: "Data de Morte", value: "death_date"},
        {name: "Brinco", value: "ring_order"},
    ]

    return (
        <div className="h-screen w-screen grid grid-cols-[1fr_auto]">
            <div className="h-full grid grid-rows-[auto_1fr] overflow-x-auto">
                <TableTopBar 
                    title="Tabela de Rebanho" 
                    sortableColumns={sortableColumns}
                    order={order}
                    sort={sort}
                    setOrder={setOrder}
                    setSort={setSort}
                    isDrawerOpen={isDrawerOpen}
                    setOpenDrawer={setOpenDrawer} 
                />
                <TableAnimal sort={sort} order={order} filter={filter} />
            </div>
            <FilterDrawer 
                childPanel={() => AnimalFilterElement({filter: filter, setFilter: setFilter})} 
                isOpen={isDrawerOpen} setOpen={setOpenDrawer} 
            />
        </div>
    )
}
