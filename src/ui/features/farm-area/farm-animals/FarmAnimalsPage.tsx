import { useEffect, useRef, useState } from "react"
import { FarmAnimalsTable } from "./FarmAnimalsTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { findAnimalsByFarm } from "./Controller"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { AnimalFarm } from "./Entities"
import { FarmAnimalsFilter } from "./FarmAnimalsFilter"
import { AnimalFilter } from "../../animals/table/api/AnimalInfo"

type FarmAnimalsPageProps = {
    farmId: string
}

export const FarmAnimalsPage = ({ farmId }: FarmAnimalsPageProps) => {

    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('ring_number')
    const [rows, setRows] = useState<AnimalFarm[]>([])
    const [isLoading, setLoading] = useState(false)
    const [isFilterOpen, setFilterOpen] = useState(false)
    const [filter, setFilter] = useState<AnimalFilter>({ isFiltered: false })
    const buttonRef = useRef<HTMLButtonElement>(null)

    const onReload = () => {
        setLoading(true)
        findAnimalsByFarm(farmId, { isFiltered: false }, sort, order)
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        setLoading(true)
        console.log("show filter: ", filter)
        findAnimalsByFarm(farmId, filter, sort, order)
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [farmId, filter, sort, order])

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
            filterProps={{ anchorEl: buttonRef, setFilterOpen }}
            reloadProps={{ onReload, isLoading }}
        />
        <FarmAnimalsTable {...{ rows, isLoading }} />
        <FarmAnimalsFilter {...{
            anchorEl: buttonRef,
            isFilterOpen,
            setFilterOpen,
            filter,
            setFilter,
            farmId
        }} />
    </div>
}
