import { JSX } from "react";
import { FilterIcon } from "../common/SvgIcons";

export const FilterButton = ({ onClick }: FilterButtonProps): JSX.Element => {
    return <button
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700
                hover:bg-gray-100 transition duration-300
                focus:outline-none focus:border-blue-200"
        onClick={onClick}
    >
        {'Habilitar Filtro'}
        <FilterIcon />
    </button>
}

interface FilterButtonProps {
    onClick: () => void
}
