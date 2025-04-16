import { JSX, useEffect, useState } from "react";

export const Drawer = (props: DrawerProps): JSX.Element => {
    const [isOpen, setOpen] = useState<boolean>(false)

    useEffect(() => {
        setOpen(props.isOpen)
    }, [props])

    return <div 
        className={`h-full grid grid-rows-[auto_1fr] transition-all duration-500 ease-in-out 
        ${isOpen ? 'max-w-96 scale-100 opacity-100 p-4' : 'max-w-0 opacity-0 scale-0'}`}
    >
        <div>
            <button 
                onClick={() => {
                    if (isOpen) { 
                        setOpen(false)
                        props.openEvent(false)
                        return
                    }
                    setOpen(false)
                    props.openEvent(false)
                }}
            >
                {"Fechar"}
            </button>
        </div>
    </div>
}

interface DrawerProps {
    isOpen: boolean;
    openEvent: (isOpen: boolean) => void;
}
