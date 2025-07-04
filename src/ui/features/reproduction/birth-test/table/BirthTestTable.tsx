import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { TableDisplay } from "@/ui/shared/display/Display";
import { IFilters } from "@/shared/interfaces/Filter";
import { buildBirthTestTable } from "./TableModel";
import { BirthTestFilter } from "./BirthTestFilter";
import { useFilterForm } from "@/ui/shared/common/FilterUtil";

export const BirthTestTable = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('name')

    const tableProps = buildBirthTestTable({ filter, sort, order })
    const { handleSubmit, control } = useFilterForm<IFilters>()
    const filterPanel = <BirthTestFilter {...{ control }} />

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "animalNumber" },
        { name: "Nome da Vaca", value: "animalName" },
        { name: "Data de Toque", value: "groupDate" },
        { name: "Data Prevista de Parto", value: "birthForecast" },
        { name: "Observações", value: "observation" }
    ]

    return <TableDisplay
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
        filterPanel={filterPanel}
        setFilter={setFilter}
        handleSubmit={handleSubmit}
    />
}
