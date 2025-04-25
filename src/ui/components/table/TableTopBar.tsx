import { JSX } from "react";
import { Label } from "../common/Label";
import { ComboBox, ComboBoxItem } from "../common/ComboBox";
import { ArrowUpIcon, FilterIcon } from "../common/SvgIcons";

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
    return <div className="grid grid-cols-[1fr_auto_auto] gap-2 p-4">
        <label className="text-2xl justify-center text-gray-700 text-center uppercase">{props.title}</label>
        <div className="grid grid-cols-[1fr_auto] gap-2">
            <div className="grid grid-cols-[auto_1fr] gap-2 justify-center">
                <Label label="Ordenar por: " />
                <ComboBox 
                    onChange={(event) => {
                        const value = event.target.value
                        props.setSort(value ? value : props.sort)
                    }}
                    items={props.sortableColumns} 
                    />
            </div>
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 
                hover:bg-gray-100 transition-colors duration-200 text-sm font-medium text-gray-700
                focus:outline-none"
                onClick={() => props.order === 'asc' ? props.setOrder('desc') : props.setOrder('asc')}
            >
                <label>{props.order === 'asc' ? "Crescente" : "Decrescente"}</label>
                <span className={`ml-auto transition-transform duration-500 ${props.order === 'asc' ? 'rotate-0' : '-rotate-180'}`}>
                    <ArrowUpIcon />
                </span>
            </button>
        </div>
        <div>
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700
                hover:bg-gray-100 transition duration-300
                focus:outline-none focus:border-blue-200"
                onClick={() => props.isDrawerOpen ? props.setOpenDrawer(false) : props.setOpenDrawer(true)}
            >
                <label>{!props.isDrawerOpen ? 'Mostrar Filtro' : 'Fechar Filtro'}</label>
                <FilterIcon />
            </button>
        </div>
    </div>
}
