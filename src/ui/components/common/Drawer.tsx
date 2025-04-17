import { JSX } from "react";
import { CloseIcon } from "./SvgIcons";

export const FilterDrawer = (props: DrawerProps) => {
    return <Drawer
        title="Controle de Filtros"
        childPanel={props.childPanel}
        isOpen={props.isOpen}
        onClose={props.onClose} 
    />
}

export const Drawer = (props: AbstractDrawerProps): JSX.Element => {

    return <div
        className={`h-full grid grid-rows-[auto_1fr] transition-all duration-500 ease-in-out overflow-auto
        ${props.isOpen ? 'max-w-96' : 'max-w-0'}`}
    >
        <div className="sticky top-0 grid bg-gray-700 grid-cols-[auto_1fr] gap-4 p-4">
            <button 
                className="text-white" 
                onClick={props.onClose} 
            >
                <CloseIcon />
            </button>
            <span 
                className="block whitespace-nowrap text-2xl px-4 overflow-clip justify-center text-white text-left"
            >
                {props.title}
            </span>
        </div>
        <div className="p-4">
            {props.childPanel()}
        </div>
    </div>
}

interface AbstractDrawerProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    childPanel: () => JSX.Element
}

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    childPanel: () => JSX.Element
}
