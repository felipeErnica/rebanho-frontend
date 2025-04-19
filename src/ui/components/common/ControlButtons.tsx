import { JSX } from "react";

export const ControlButton = ({ icon }: ControlButtonProps): JSX.Element => {
    return <button className="text-gray-700 cursor-pointer hover:text-gray-400">
        {icon()}
    </button>
}

interface ControlButtonProps {
    icon: () => JSX.Element
}
