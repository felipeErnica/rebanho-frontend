import { JSX } from "react";

export const ComboBox = (props: ComboBoxProps): JSX.Element => {
    return (
        <>
            <label>{props.label}</label>
            <select className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm 
                    focus:outline-none focus:border-blue-500 relative
                    hover:not-focus:bg-gray-100 transition-colors ease-in-out duration-300"
            >
                {props.items.map(item => <option>{item}</option>)}
            </select>
        </>
    )
}

interface ComboBoxProps {
    label: string;
    items: string[];
}
