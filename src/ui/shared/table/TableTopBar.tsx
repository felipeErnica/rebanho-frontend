import { JSX, ReactNode, Ref, useEffect, useState } from "react";
import { ComboBox, ComboBoxItem } from "../common/ComboBox";
import { Button } from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import FilterAlt from "@mui/icons-material/FilterAlt";
import Refresh from "@mui/icons-material/Refresh";
import { IFilters } from "@/shared/interfaces/Filter";

interface TableTopBarProps {
    sortableColumns: ComboBoxItem[];
    isDrawerOpen: boolean;
    setOpenDrawer: (isDrawerOpen: boolean) => void;
    sort: string;
    setSort: (newSort: string) => void;
    setOrder: (order: string) => void;
    setFilter?: (filter: IFilters) => void
    order: string;
    buttonRef: Ref<HTMLButtonElement>
    otherActions?: ReactNode | ReactNode[]
}


export const TableTopBarOld = (props: TableTopBarProps): JSX.Element => {

    const [sortedColumns, setSortedColumns] = useState(props.sortableColumns)

    useEffect(() => {
        const sortedColumns = props.sortableColumns.sort()
        setSortedColumns(sortedColumns)
    }, [props.sortableColumns])

    return <div className="flex flex-row gap-2 p-4">
        <div className="grow">
            <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => props.setFilter && props.setFilter({ isFiltered: false })}
            >
                Recarregar Informações
            </Button>
        </div>
        <div className="flex flex-row gap-2">
            <ComboBox
                className="min-w-80"
                items={sortedColumns}
                onChange={(value) => value && props.setSort(value)}
                label="Ordenar Por"
            />
            <Button
                variant="outlined"
                onClick={() => props.order === 'asc' ? props.setOrder('desc') : props.setOrder('asc')}
                endIcon={
                    <ArrowUpward
                        className={`ml-auto transition-transform duration-500 ${props.order === 'asc' ? 'rotate-0' : '-rotate-180'}`}
                    />
                }
            >
                {props.order === 'asc' ? "Crescente" : "Decrescente"}
            </Button>
            <Button
                className="h-full"
                variant="outlined"
                ref={props.buttonRef}
                onClick={() => props.setOpenDrawer(true)}
                endIcon={<FilterAlt />}
            >
                Mostrar Filtro
            </Button>
            {props.otherActions}
        </div>
    </div>
}
