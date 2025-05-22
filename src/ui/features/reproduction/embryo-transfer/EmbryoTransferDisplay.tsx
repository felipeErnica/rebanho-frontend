import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { Display } from "@/ui/components/display/Display";
import { IFilters } from "@/interfaces/Filter";
import { buildEmbryoTable } from "./TableModel";
import { EmbryoTransferFilter } from "./EmbryoTransferFilter";

export const EmbryoTransferDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('transferDate')

    const tableProps = buildEmbryoTable({filter, sort, order})

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco da Receptora", value: "receiverNumber"},
        { name: "Nome da Receptora", value: "receiverName"},
        { name: "Nome do Touro", value: "bullName"},
        { name: "Data de Transferência", value: "transferDate"},
        { name: "Observações", value: "observation"}
    ]

    return <Display 
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        filterPanel={<EmbryoTransferFilter filter={filter} setFilter={setFilter} />}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
    />
}
