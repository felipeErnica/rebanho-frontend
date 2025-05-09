import { JSX, MouseEventHandler, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>
    children?: ReactNode | ReactNode[]
    className?: string
}

export const Button = (props: ButtonProps): JSX.Element => {
    return <button
        className={twMerge(`flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 
                hover:bg-gray-100 ransition-colors duration-200 text-sm font-medium text-gray-700
                focus:outline-none`, props.className)}
        onClick={props.onClick}
    >
        {props.children}
    </button>
}
