import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/components/common/ComboBox";
import { Display } from "@/ui/components/display/Display";
import { IFilters } from "@/shared/interfaces/Filter";
import { buildSlaughterhouseTable } from "./TableModel";
import { SlaughterhouseFilter } from "./SlaughterhouseFilter";

export const SlaughterhouseDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('value')

    const tableProps = buildSlaughterhouseTable({filter, sort, order})

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "animalNumber" },
        { name: "Nome da Vaca", value: "animalName" },
        { name: "Data de Nascimento", value: "lossDate" },
        { name: "Data de Abate", value: "slaughterDate" },
        { name: "Última Pesagem", value: "weight" },
        { name: "Peso Morto", value: "deadWeight" },
    ]

    return <Display 
        order={order}
        setOrder={setOrder}
        sort={sort}
        setSort={setSort}
        filterPanel={<SlaughterhouseFilter filter={filter} setFilter={setFilter} />}
        sortableColumns={sortableColumns}
        tableProps={tableProps}
    />
}
