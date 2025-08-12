import ArrowUpward from "@mui/icons-material/ArrowUpward"
import Button from "@mui/material/Button"
import { ComboBox, ComboBoxItem } from "../common/ComboBox"
import Refresh from "@mui/icons-material/Refresh"
import { ReactNode, RefObject, useMemo } from "react"
import FilterAlt from "@mui/icons-material/FilterAlt"

type TableTopBarProps = {
    orderProps?: OrderButtonProps
    sortProps?: SortComboBoxProps
    filterProps?: FilterButtonProps
    otherProps?: ReactNode | ReactNode[]
    reloadProps?: ReloadButtonProps
}

export const TableTopBar = ({
    orderProps,
    sortProps,
    filterProps,
    otherProps,
    reloadProps,
}: TableTopBarProps) => {
    return <div className="p-4 flex flex-row">
            <div className="grow">
            {reloadProps && <ReloadButton {...reloadProps} />}
            </div>
        <div className="flex flex-row-reverse gap-4">
            {otherProps}
            {filterProps && <FilterButton {...filterProps} />}
            {orderProps && <OrderButton {...orderProps} />}
            {sortProps && <SortComboBox {...sortProps} />}
        </div>
    </div>
}

type OrderButtonProps = {
    order: string
    setOrder: (order: string) => void
}

const OrderButton = ({ order, setOrder }: OrderButtonProps) => {
    const isAsc = order === 'asc';
    const rotationClass = isAsc ? 'rotate-0' : 'rotate-180';

    const arrowIcon = useMemo(() => (
        <ArrowUpward className={`transition-transform duration-500 ease-in-out ${rotationClass}`} />
    ), [rotationClass]);

    return <Button
        variant="outlined"
        onClick={() => setOrder(isAsc ? 'desc' : 'asc')}
        endIcon={arrowIcon}
    >
        {isAsc ? "Crescente" : "Decrescente"}
    </Button>
}

type SortComboBoxProps = {
    sortColumns: ComboBoxItem[]
    sort: string
    setSort: (sort: string) => void
    defaultSort: string
}

const SortComboBox = ({ sort, setSort, sortColumns, defaultSort }: SortComboBoxProps) => {
    return <ComboBox
        className="w-[250]"
        label="Ordenar Por"
        items={sortColumns}
        value={sort}
        onChange={(value) => setSort(value ?? defaultSort)}
    />
}

type ReloadButtonProps = {
    loading?: boolean
    onReload: () => void
    variant?: 'text' | 'outlined' | 'contained'
}

export const ReloadButton = ({ onReload, loading, variant }: ReloadButtonProps) => {
    return <Button
        variant={variant ?? 'outlined'}
        loading={loading}
        loadingPosition="start"
        startIcon={!loading && <Refresh />}
        onClick={onReload}
    >
        Recarregar Informações
    </Button>
}

type FilterButtonProps = {
    setFilterOpen: (isFilterOpen: boolean) => void
    anchorEl: RefObject<HTMLButtonElement | null>
}

const FilterButton = ({ setFilterOpen, anchorEl }: FilterButtonProps) => {
    return <Button
        variant="outlined"
        ref={anchorEl}
        startIcon={<FilterAlt />}
        onClick={() => setFilterOpen(true)}
    >
        Abrir Filtro
    </Button>
}
