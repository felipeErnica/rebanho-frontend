import { JSX, useState } from "react";
import { AnimalFilter } from "@/types/Animal";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { Display } from "@/ui/components/display/Display";
import { buildTable } from "./TableAnimal";
import { AnimalFilterElement } from "./AnimalFilter";

export const AnimalDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<AnimalFilter>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('name')

    const tableProps = buildTable({filter, sort, order})

    const sortableColumns: ComboBoxItem[] = [
        { name: "Nome", value: "name" },
        { name: "Data de Morte", value: "death_date" },
        { name: "Brinco", value: "ring_order" },
    ]

    return <Display 
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        filterPanel={<AnimalFilterElement filter={filter} setFilter={setFilter}/>}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
    />
}
