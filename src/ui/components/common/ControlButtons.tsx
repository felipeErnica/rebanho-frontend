import React, { JSX } from "react";

export const ControlButton = ({ onClick, icon }: ControlButtonProps): JSX.Element => {
    return <button 
        className="text-gray-700 cursor-pointer hover:text-gray-400"
        onClick={onClick}
    >
        {icon()}
    </button>
}

interface ControlButtonProps {
    icon: () => JSX.Element
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}
