import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { TableDisplay } from "@/ui/shared/display/Display";
import { IFilters } from "@/shared/interfaces/Filter";
import { buildLactationTable } from "./TableModel";
import { LactationFilter } from "./LactationHistFilter";
import { useFilterForm } from "@/ui/shared/common/FilterUtil";

export const LactationHistTable = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('value')

    const tableProps = buildLactationTable({ filter, sort, order })
    const { control, handleSubmit } = useFilterForm<IFilters>()
    const filterPanel = <LactationFilter {...{ control }} />

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

    return <TableDisplay {...{
        order,
        setOrder,
        sort,
        setSort,
        sortableColumns,
        filterPanel,
        tableProps,
        handleSubmit,
        setFilter
    }}/>
}
