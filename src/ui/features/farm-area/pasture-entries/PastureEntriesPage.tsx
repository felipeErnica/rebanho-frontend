/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import { PastureEntriesFilter } from "./Entities"
import { findPastureEntries } from "./Controller"
import { PastureEntriesTable } from "./PastureEntriesTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { PastureEntriesFilterPopover } from "./PastureEntriesFilter"
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
    const [isFilterOpen, setFilterOpen] = useState(false)
    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = (cursor?: string) => findPastureEntries(pastureId, filter, sort, order, cursor)
    const pagination = usePagination(fetchPage)
    const { isPageLoading, onReload } = pagination

    useEffect(() => setLoading(isPageLoading), [isPageLoading])
    useEffect(onReload, [pastureId, filter, sort, order])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco', value: defaultSort },
        { name: 'Nome', value: 'animal_name,entry_date' },
        { name: 'Data de Nascimento', value: 'animal_birth_date,entry_date' },
        { name: 'Data de Entrada', value: 'entry_date' },
    ]

    return <div className="h-full w-full flex flex-col">
        <TableTopBar
            sortProps={{ sortColumns, sort, setSort, defaultSort }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
            reloadProps={{
                isLoading, 
                onReload: () => {
                    setFilter({ isFiltered: false })
                    onReload()
                }
            }}
        />
        <PastureEntriesTable {...{ pagination, isLoading }} />
        <PastureEntriesFilterPopover {...{
            filter,
            setFilter,
            anchorEl,
            isFilterOpen,
            setFilterOpen
        }} />
    </div>

}
