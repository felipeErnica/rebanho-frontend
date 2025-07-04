import { useState } from "react";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { TableDisplay } from "@/ui/shared/display/Display";
import { BirthFilter } from "./BirthFilter";
import { buildTable as buildBirthTable } from "./tableModel";
import { IFilters } from "@/shared/interfaces/Filter";
import { useFilterForm } from "@/ui/shared/common/FilterUtil";

export const BirthTable = () => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('name')

    const tableProps = buildBirthTable({ filter, sort, order })
    const { handleSubmit, control } = useFilterForm<IFilters>()
    const filterPanel = <BirthFilter {...{ control }} />

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "ringNumber" },
        { name: "Nome da Vaca", value: "motherName" },
        { name: "Data de Nascimento", value: "birthDate" },
        { name: "Sexo", value: "sex" },
        { name: "Nome do Pai", value: "fatherName" },
        { name: "Peso de Nascimento", value: "birthWeight" },
        { name: "Observações", value: "observation" }
    ]

    return <TableDisplay
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
        handleSubmit={handleSubmit}
        setFilter={setFilter}
        filterPanel={filterPanel}
    />
}
