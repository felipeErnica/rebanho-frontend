import { JSX, useState } from "react";
import { AnimalFilter } from "@/ui/features/animals/api/AnimalInfo";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { Display } from "@/ui/components/display/Display";
import { buildTable as buildAnimalsTable } from "./TableAnimal";
import { AnimalFilterElement } from "./AnimalFilter";

export const AnimalDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<AnimalFilter>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('name')

    const tableProps = buildAnimalsTable({ filter, sort, order })
    const filterPanel = <AnimalFilterElement filter={filter} setFilter={setFilter} />

    const sortableColumns: ComboBoxItem[] = [
        { name: "Nome", value: "name" },
        { name: "Data de Morte", value: "death_date" },
        { name: "Brinco", value: "ring_order" },
    ]

    return <Display {...{
        sort,
        setSort,
        order,
        setOrder,
        tableProps,
        sortableColumns,
        filterPanel
    }} />
}
