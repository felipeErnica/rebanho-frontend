import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { Display } from "@/ui/components/display/Display";
import { IFilters } from "@/shared/interfaces/Filter";
import { buildLossTable } from "./TableModel";
import { LossFilter } from "./LossFilter";

export const LossDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('name')

    const tableProps = buildLossTable({filter, sort, order})

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "animalNumber"},
        { name: "Nome da Vaca", value: "animalName"},
        { name: "Data de Toque", value: "groupDate"},
        { name: "Data Prevista de Parto", value: "birthForecast"},
        { name: "Observações", value: "observation"}
    ]

    return <Display 
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        filterPanel={<LossFilter filter={filter} setFilter={setFilter} />}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
    />
}
