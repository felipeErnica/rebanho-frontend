import { JSX, useEffect, useState } from "react";
import { Label } from "../common/Label";
import { ComboBox } from "../common/ComboBox";
import { ArrowUpIcon, FilterIcon } from "../common/SvgIcons";

export const TableTopBar = (props: TableTopBarProps): JSX.Element => {

    const [direction, setDirection] = useState<string>("asc")
    const [isFilterOpen, setFilterOpen] = useState(false)

    useEffect(() => {
        setFilterOpen(props.isFilterOpen)
    }, [props])

    return <div className="grid grid-cols-[1fr_auto_auto] gap-2 p-4">
        <label className="text-2xl justify-center text-gray-700 text-center uppercase">{props.title}</label>
        <div className="grid grid-cols-[1fr_auto] gap-2">
            <div className="grid grid-cols-[auto_1fr] gap-2 justify-center">
                <Label forLabel="order" label="Ordenar por: " />
                <ComboBox id="order" items={["aaaa", "bbbb"]} />
            </div>
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 
                hover:bg-gray-100 transition-colors duration-200 text-sm font-medium text-gray-700
                focus:outline-none"
                onClick={() => direction === 'asc' ? setDirection("desc") : setDirection("asc")}
            >
                <label>{direction === 'asc' ? "Crescente" : "Decrescente"}</label>
                <span className={`ml-auto transition-transform duration-500 ${direction === 'asc' ? 'rotate-0' : '-rotate-180'}`}>
                    <ArrowUpIcon />
                </span>
            </button>
        </div>
        <div>
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700
                hover:bg-gray-100 transition duration-300
                focus:outline-none focus:border-blue-200"
                onClick={() => {
                    if (isFilterOpen) {
                        props.openFilter(false)
                        setFilterOpen(false)
                        return
                    }
                    setFilterOpen(true)
                    props.openFilter(true)
                }}
            >
                {'Habilitar Filtro'}
                <FilterIcon />
            </button>
        </div>
    </div>
}

interface TableTopBarProps {
    title: string;
    openFilter: (openFilter: boolean) => void
    isFilterOpen: boolean;
}
