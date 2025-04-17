import { FormEventHandler, HTMLInputTypeAttribute } from "react"

export const InputBox = (props: InputBoxProps) => {
    return <input
        type={props.type}
        step={props.step}
        className={`w-full transition-colors ease-in-out duration-300 px-4 py-2 bg-white text-sm text-gray-800 border border-gray-300 rounded-lg
                    focus:outline-none focus:border-blue-500
                    hover:not-focus:bg-gray-100
                    ${props.className ? props.className : ''}`
        }
        placeholder={props.placeholder ? props.placeholder : undefined}
        onInput={props.onInput ? props.onInput : undefined} />
}

interface InputBoxProps {
    type: HTMLInputTypeAttribute;
    step?: string;
    placeholder?: string;
    className?: string;
    onInput?: FormEventHandler<HTMLInputElement>;
}
