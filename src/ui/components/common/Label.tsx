import { JSX } from "react";

export const Label = (props: LabelProps):JSX.Element => {
    return <label 
        className="w-full flex text-gray-700 text-sm justify-center items-center"
        htmlFor={props.forLabel}
    >
        {props.label}
    </label>
}

interface LabelProps {
    label: string;
    forLabel?: string;
}
