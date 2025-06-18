import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { Display } from "@/ui/components/display/Display";
import { IFilters } from "@/shared/interfaces/Filter";
import { buildWeightTable } from "./TableModel";
import { WeightFilter } from "./WeightFilter";

export const WeightDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('value')

    const tableProps = buildWeightTable({ filter, sort, order })

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "animalNumber" },
        { name: "Nome do Animal", value: "animalName" },
        { name: "Data da Pesagem", value: "groupDate" },
        { name: "Peso", value: "weight" },
    ]

    return <Display
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        filterPanel={<WeightFilter filter={filter} setFilter={setFilter} />}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
    />
}
