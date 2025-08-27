/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useRef, useState } from "react"
import { PastureEntry, PastureEntriesFilter } from "./Entities"
import { findPastureEntries, findPastureEntriesTotal } from "./Controller"
import { PastureEntriesTable } from "./PastureEntriesTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { PastureEntriesFilterPopover } from "./PastureEntriesFilter"
import { AddAnimalToPasture } from "../pasture-animals/AddAnimalToPasture"
import Button from "@mui/material/Button"
import Add from "@mui/icons-material/Add"
import { usePagination } from "@/ui/shared/table/PageTable"

type PastureEntriesPageProps = {
    pastureId: string
}

export const PastureEntriesPage = ({ pastureId }: PastureEntriesPageProps) => {

    const defaultSort = 'animal_order,entry_date'
    const [filter, setFilter] = useState<PastureEntriesFilter>({ isFiltered: false })
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')
    const [isLoading, setLoading] = useState(false)
    const [isAddAnimalOpen, setAddAnimalOpen] = useState(false)
    const [isFilterOpen, setFilterOpen] = useState(false)
    const [total, setTotal] = useState(0)
    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        findPastureEntriesTotal(pastureId, filter)
            .then(respose => setTotal(respose.json.total))
            .catch(() => setTotal(0))
        return findPastureEntries(pastureId, filter, sort, order, cursor)
    }, [filter, sort, order])

    const { rows, fetchNextPage, scrollRef } = usePagination<PastureEntry>({ fetchPage, setLoading })

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco', value: defaultSort },
        { name: 'Nome', value: 'animal_name,entry_date' },
        { name: 'Data de Nascimento', value: 'animal_birth_date,entry_date' },
        { name: 'Data de Entrada', value: 'entry_date' },
    ]

    const otherActions = (
        <>
            <Button
                onClick={() => setAddAnimalOpen(true)}
                startIcon={<Add />}
                variant="outlined"
            >
                Adicionar Animais
            </Button>
            <AddAnimalToPasture {...{ pastureId, isAddAnimalOpen, setAddAnimalOpen }} />
        </>
    )

    return <div className="h-full w-full flex flex-col">
        <TableTopBar
            sortProps={{ sortColumns, sort, setSort, defaultSort }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
            otherProps={otherActions}
            reloadProps={{ loading: isLoading, onReload }}
        />
        <PastureEntriesTable {...{ rows, fetchNextPage, isLoading, scrollRef, total }} />
        <PastureEntriesFilterPopover {...{
            filter,
            setFilter,
            anchorEl,
            isFilterOpen,
            setFilterOpen
        }} />
    </div>

}
