import Check from "@mui/icons-material/Check"
import Close from "@mui/icons-material/Close"
import Delete from "@mui/icons-material/Delete"
import Edit from "@mui/icons-material/Edit"
import Visibility from "@mui/icons-material/Visibility"
import { IconButton } from "@mui/material"
import { ReactNode } from "react"

type ControlButtonContainerProps = {
    children: ReactNode | ReactNode[]
}

export const ControlButtonContainer = ({ children }: ControlButtonContainerProps) => {
    return <div className="flex flex-row gap-2">
        {children}
    </div>
}

type EditControlButtonProps = {
    setEditing: (isEditing: boolean) => void
}

export const EditControlButton = ({ setEditing }: EditControlButtonProps) => {
    return <IconButton onClick={() => setEditing(true)}>
        <Edit />
    </IconButton>
}

type DeleteControlButtonProps = {
    onDelete: () => void
}

export const DeleteControlButton = ({ onDelete }: DeleteControlButtonProps) => {
    return <IconButton onClick={onDelete}>
        <Delete />
    </IconButton>
}

type ShowControlButtonProps = {
    onShow: () => void
}

export const ShowControlButton = ({ onShow }: ShowControlButtonProps) => {
    return <IconButton onClick={onShow}>
        <Visibility />
    </IconButton>
}

type EditingControlButtonProps = {
    setEditing: (isEditing: boolean) => void
    onSave: () => void
}

export const EditingButtonControls = ({ setEditing, onSave }: EditingControlButtonProps) => {
    return <div className="flex flex-row gap-2">
        <IconButton onClick={() => {
            onSave()
            setEditing(false)
        }}>
            <Check />
        </IconButton >
        <IconButton onClick={() => setEditing(false)}>
            <Close />
        </IconButton>
    </div >
}
