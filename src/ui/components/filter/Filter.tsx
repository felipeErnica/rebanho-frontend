import { JSX, useState } from "react"
import { ComboBox } from "../text-components/ComboBox"

const FilterIcon = (): JSX.Element => {
    return <svg
        viewBox="0 0 24 24"
        width="24px"
        height="24px"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier"
            stroke-width="0">
        </g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 
                        3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 
                        20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 
                        20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 
                        7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 
                        14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 
                        14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 
                        7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
            </path>
        </g>
    </svg>
}

const ArrowDownIcon = (): JSX.Element => {
    return <svg
        viewBox="0 0 24 24"
        width="24px"
        height="24px"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g
            id="SVGRepo_bgCarrier"
            stroke-width="0">
        </g>
        <g id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round">
        </g>
        <g id="SVGRepo_iconCarrier">
            <path
                d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 
                13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 
                9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 
                5.70711 9.71069Z"
                fill="currentColor"
            >
            </path>
        </g>
    </svg>
}

export const Filter = ({ panel }: FilterProps): JSX.Element => {
    const [isOpen, setOpen] = useState(false)

    return <div className="flex flex-col">
        <button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 shadow-sm 
            hover:bg-gray-100 hover:shadow-md transition duration-200 text-sm font-medium text-gray-700"
            onClick={() => !isOpen ? setOpen(true) : setOpen(false)}
        >
            <FilterIcon />
            <label>Filtros</label>
            <span className={`ml-auto transition-transform duration-200 ${!isOpen ? 'rotate-0' : '-rotate-90'}`}>
                <ArrowDownIcon />
            </span>
        </button>
        <div
            className={`flex flex-col transition-all duration-500 ease-in-out overflow-hidden
                ${isOpen ? 'max-h-96 opacity-100 scale-100 p-4' : 'max-h-0 opacity-0 scale-95'}`} >
            {panel()}
            <div className="grid grid-cols-2 gap-2 pt-4">
                <div className="grid grid-cols-[1fr_2fr] grid-rows-2 gap-2">
                    <ComboBox items={["aaaa", "bbbb"]} label="Ordenar Por:" />
                    <ComboBox items={["Crescente", "Descrescente"]} label="Sentido:" />
                </div>
            </div>
        </div>
    </div>
}

interface FilterProps {
    panel: () => JSX.Element
}
