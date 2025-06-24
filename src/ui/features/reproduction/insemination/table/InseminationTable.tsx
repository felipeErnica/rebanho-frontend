import { TableDisplay } from "@/ui/shared/display/Display"
import { buildInseminationTable } from "./TableModel"
import { useState } from "react"
import { InseminationFilter } from "./InseminationFilter"

export const InseminationTable = () => {

    const [filter, setFilter] = useState({ isFiltered: false })
    const [order, setOrder] = useState('number')
    const [sort, setSort] = useState('asc')

    const tableModel = buildInseminationTable({filter, sort, order})

    const sortableColumns = [
        { name: "Brinco", value: "animalNumber"},
        { name: "Nome da Vaca", value: "animalName"},
        { name: "Data de Inseminação", value: "groupDate"},
        { name: "Touro", value: "bullName"},
        { name: "Status", value: "status"},
        { name: "Observações", value: "observation"}
    ]

    return <TableDisplay
        filterPanel={<InseminationFilter {...{filter ,setFilter}} />}
        tableProps={tableModel}
        setOrder={setOrder}
        setSort={setSort}
        sortableColumns={sortableColumns}
        sort={sort}
        order={order}
    />
}
