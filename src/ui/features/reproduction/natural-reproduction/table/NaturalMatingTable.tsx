import { TableDisplay } from "@/ui/shared/display/Display"
import { useState } from "react"
import { buildMatingTable } from "./TableModel"
import { MatingFilter } from "./MatingFilter"

export const NaturalMatingTable = () => {
    const [filter, setFilter] = useState({ isFiltered: false })
    const [order, setOrder] = useState('number')
    const [sort, setSort] = useState('asc')

    const tableModel = buildMatingTable({filter, sort, order})

    const sortableColumns = [
        { name: "Brinco", value: "animalNumber"},
        { name: "Nome da Vaca", value: "animalName"},
        { name: "Data de Monta", value: "matingDate"},
        { name: "Touro", value: "bullName"},
        { name: "Status", value: "status"},
        { name: "Observações", value: "observation"}
    ]

    return <TableDisplay
        filterPanel={<MatingFilter {...{filter ,setFilter}} />}
        tableProps={tableModel}
        setOrder={setOrder}
        setSort={setSort}
        sortableColumns={sortableColumns}
        sort={sort}
        order={order}
    />
}
