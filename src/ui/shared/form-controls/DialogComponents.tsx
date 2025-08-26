import { Button } from "@mui/material"
import { ReactNode } from "react"

type DialogActionButtonsProps = {
    onClose: () => void
    onSave: () => void
    saveText: string
}

export const DialogActionButtons = ({ onClose, onSave, saveText }: DialogActionButtonsProps) => {
    return <>
        <Button onClick={onSave}>
            {saveText}
        </Button>
        <Button onClick={onClose}>
            Cancelar
        </Button>
    </>
}

type DialogContainerProps = {
    children?: ReactNode | ReactNode[]
    className?: string
}

export const DialogContainer = ({ children, className }: DialogContainerProps) => {
    return <div className={`w-[500] p-4 ${className}`}>
        {children}
    </div>
}
