import { FormEventHandler, HTMLInputTypeAttribute } from "react"

export const InputBox = (props: InputBoxProps) => {
    return <input
        type={props.type}
        className="w-full px-4 py-2 bg-white text-sm text-gray-800 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    hover:not-focus:bg-gray-100"
        placeholder={props.placeholder ? props.placeholder : undefined}
        onInput={props.onInput ? props.onInput : undefined} />
}

interface InputBoxProps {
    type: HTMLInputTypeAttribute;
    placeholder?: string;
    onInput?: FormEventHandler<HTMLInputElement>;
}
