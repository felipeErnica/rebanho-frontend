import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { Display } from "@/ui/components/display/Display";
import { IFilters } from "@/interfaces/Filter";
import { buildLactationTable } from "./TableModel";
import { LactationFilter } from "./LactationHistFilter";

export const LactationDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('value')

    const tableProps = buildLactationTable({ filter, sort, order })

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "cowNumber" },
        { name: "Nome do Animal", value: "cowName" },
        { name: "Data de Parição", value: "calfBirthDate" },
        { name: "Data de Início", value: "startDate" },
        { name: "Data de Fim", value: "endDate" },
        { name: "Período de Produção (dias)", value: "productionPeriod" },
        { name: "Produção Total", value: "productionTotal" },
        { name: "Produção Média", value: "averageProduction" },
        { name: "Pico de Produção", value: "peakProduction" },
        { name: "I.S.R.", value: "isr" },
    ]

    return <Display
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        filterPanel={<LactationFilter filter={filter} setFilter={setFilter} />}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
    />
}
