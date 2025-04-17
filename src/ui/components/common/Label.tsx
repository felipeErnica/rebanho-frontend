import { JSX } from "react";

export const Label = (props: LabelProps):JSX.Element => {
    return <span 
        className={`h-full flex items-center whitespace-nowrap overflow-clip w-full text-gray-600 text-sm text-left 
            ${props.className ? props.className : ''}`
        }
    >
        {props.label}
    </span>
}

interface LabelProps {
    className?: string;
    label: string;
}
