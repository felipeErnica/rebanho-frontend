import { useCallback, useRef, useState } from "react"
import { FarmAnimalsTable } from "./FarmAnimalsTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { findAnimalsByFarm, findFarmAnimalsTotal } from "./Controller"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { FarmAnimalsFilter } from "./FarmAnimalsFilter"
import { AnimalFilter } from "../../animals/table/api/AnimalInfo"
import { usePagination } from "@/ui/shared/table/PageTable"
import { AnimalFarm } from "./Entities"

type FarmAnimalsPageProps = {
    farmId: string
}

export const FarmAnimalsPage = ({ farmId }: FarmAnimalsPageProps) => {

    const [total, setTotal] = useState(0)
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('ring_order')
    const [isLoading, setLoading] = useState(false)
    const [isFilterOpen, setFilterOpen] = useState(false)
    const [filter, setFilter] = useState<AnimalFilter>({ isFiltered: false })

    const fetchPage = useCallback((cursor?: string) => {
        findFarmAnimalsTotal(farmId, filter)
            .then((response) => setTotal(response.json.total))
            .catch(() => setTotal(0))
        return findAnimalsByFarm(farmId, filter, sort, order, cursor)
    }, [farmId, filter, sort, order])

    const anchorEl = useRef<HTMLButtonElement>(null)
    const { rows, fetchNextPage, scrollRef } = usePagination<AnimalFarm>({ fetchPage, setLoading })

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco', value: 'ring_order' },
        { name: 'Nome', value: 'name' },
        { name: 'Data de Nascimento', value: 'birth_date' },
    ]

    return <div className="h-full w-full flex flex-col">
        <TableTopBar
            orderProps={{ order, setOrder }}
            sortProps={{ sort, setSort, sortColumns, defaultSort: 'ring_order' }}
            filterProps={{ anchorEl, setFilterOpen }}
            reloadProps={{ onReload, loading: isLoading }}
        />
        <FarmAnimalsTable {...{ rows, isLoading, fetchNextPage, scrollRef, total }} />
        <FarmAnimalsFilter {...{
            anchorEl,
            isFilterOpen,
            setFilterOpen,
            filter,
            setFilter,
            farmId
        }} />
    </div>
}
