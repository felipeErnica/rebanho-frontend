import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { Display } from "@/ui/components/display/Display";
import { IFilters } from "@/shared/interfaces/Filter";
import { buildMilkTable } from "./TableModel";
import { MilkEntriesFilter } from "./MilkEntriesFilter";

export const MilkDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('value')

    const tableProps = buildMilkTable({ filter, sort, order })

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "animalNumber" },
        { name: "Nome do Animal", value: "animalName" },
        { name: "Data da Marcação", value: "entryDate" },
        { name: "Marcação de Leite", value: "milkQuantity" },
    ]

    return <Display
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        filterPanel={<MilkEntriesFilter filter={filter} setFilter={setFilter} />}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
    />
}
