import { useCallback, useEffect, useRef, useState } from "react"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { PastureAnimal } from "./Entities"
import { findAnimalsByPasture } from "./Controller"
import { PastureAnimalsTable } from "./PastureAnimalsTable"
import { PastureAnimalsFilter } from "./PastureAnimalsFilter"
import { AnimalFilter } from "../../animals/table/api/AnimalInfo"

type PastureAnimalsPageProps = {
    pastureId: string
}

export const PastureAnimalsPage = ({ pastureId }: PastureAnimalsPageProps) => {

    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('ring_number')
    const [rows, setRows] = useState<PastureAnimal[]>([])
    const [isLoading, setLoading] = useState(false)
    const [isFilterOpen, setFilterOpen] = useState(false)
    const [filter, setFilter] = useState<AnimalFilter>({ isFiltered: false })
    const anchorEl = useRef<HTMLButtonElement>(null)

    const onReload = useCallback(() => {
        setLoading(true)
        findAnimalsByPasture(pastureId, sort, order)
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [pastureId, order, sort])

    useEffect(() => onReload(), [onReload])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco', value: 'ring_number' },
        { name: 'Nome', value: 'name' },
        { name: 'Data de Nascimento', value: 'birth_date' },
        { name: 'Data de Morte', value: 'death_date' },
    ]

    return <div className="h-full w-full flex flex-col">
        <TableTopBar
            orderProps={{ order, setOrder }}
            sortProps={{ sort, setSort, sortColumns, defaultSort: 'ring_number' }}
            reloadProps={{ onReload, isLoading }}
            filterProps={{ setFilterOpen, anchorEl }}
        />
        <PastureAnimalsTable {...{ rows, isLoading }} />
        <PastureAnimalsFilter {...{ 
            isFilterOpen, 
            setFilterOpen, 
            filter, 
            setFilter, 
            anchorEl,
        }} />
    </div>
}
