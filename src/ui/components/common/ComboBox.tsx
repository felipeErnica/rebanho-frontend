import { ChangeEventHandler, JSX } from "react";
export const ComboBox = (props: ComboBoxProps): JSX.Element => {
    return (
        <select
            name={props.id}
            className="w-full block px-4 py-2 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 text-sm 
                    focus:outline-none focus:border-blue-500
                    hover:not-focus:bg-gray-100 transition-colors ease-in-out duration-300"
            defaultValue={props.placeholder}
            onChange={props.onChange}
        >
            {props.placeholder ? <option>{props.placeholder}</option> : null}
            {props.items.map(item => {
                return <option 
                    className="text-sm appearance-none" 
                    value={item.value ? item.value : item.name}
                >
                    {item.name}
                </option>
            })}
        </select>
    )
}

interface ComboBoxProps {
    placeholder?: string;
    items: ComboBoxItem[];
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    id?: string;
}

export interface ComboBoxItem {
    name: string;
    value?: string;
}
