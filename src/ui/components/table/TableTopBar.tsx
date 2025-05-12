import { JSX } from "react";
import { ComboBoxItem } from "../common/ComboBox";
import { Autocomplete, Button, TextField } from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import FilterAltOff  from "@mui/icons-material/FilterAltOff";
import FilterAlt from "@mui/icons-material/FilterAlt";

interface TableTopBarProps {
    title: string;
    sortableColumns: ComboBoxItem[];
    isDrawerOpen: boolean;
    setOpenDrawer: (isDrawerOpen: boolean) => void;
    sort: string;
    setSort: (newSort: string) => void;
    setOrder: (order: string) => void;
    order: string;
}

export const TableTopBar = (props: TableTopBarProps): JSX.Element => {
    return <div className="grid grid-cols-[2fr_1fr_auto] gap-2 p-4">
        <label className="text-2xl justify-center text-gray-700 text-center uppercase">{props.title}</label>
        <div className="flex flex-rox gap-2">
            <Autocomplete
                className="grow"
                handleHomeEndKeys
                clearOnBlur
                selectOnFocus
                openOnFocus
                clearOnEscape
                options={props.sortableColumns.map((column) => column.name)}
                renderInput={(params) => <TextField {...params} label="Ordenar Por" />}
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
        </div>
        <div>
            <Button
                className="h-full"
                variant="outlined"
                onClick={() => props.isDrawerOpen ? props.setOpenDrawer(false) : props.setOpenDrawer(true)}
                endIcon={!props.isDrawerOpen ? <FilterAlt /> : <FilterAltOff />}
            >
                {!props.isDrawerOpen ? "Mostrar Filtro" : "Fechar Filtro"}
            </Button>
        </div>
    </div>
}
