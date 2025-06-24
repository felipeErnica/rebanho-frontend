import { JSX, useState } from "react";
import { AnimalFilter } from "@/ui/features/animals/api/AnimalInfo";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { TableDisplay } from "@/ui/shared/display/Display";
import { buildTable as buildAnimalsTable } from "./TableModel";
import { AnimalFilterElement } from "./AnimalFilter";

export const AnimalsTable = (): JSX.Element => {
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

    return <TableDisplay {...{
        sort,
        setSort,
        order,
        setOrder,
        tableProps,
        sortableColumns,
        filterPanel
    }} />
}
