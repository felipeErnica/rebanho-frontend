import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { Display } from "@/ui/components/display/Display";
import { BirthFilter } from "./BirthFilter";
import { buildTable as buildBirthTable } from "./tableModel";
import { IFilters } from "@/shared/interfaces/Filter";

export const BirthDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('name')

    const tableProps = buildBirthTable({filter, sort, order})

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "ringNumber"},
        { name: "Nome da Vaca", value: "motherName"},
        { name: "Data de Nascimento", value: "birthDate"},
        { name: "Sexo", value: "sex"},
        { name: "Nome do Pai", value: "fatherName"},
        { name: "Peso de Nascimento", value: "birthWeight"},
        { name: "Observações", value: "observation"}
    ]

    return <Display 
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        filterPanel={<BirthFilter filter={filter} setFilter={setFilter} />}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
    />
}
