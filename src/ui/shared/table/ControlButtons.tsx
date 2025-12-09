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
    return <div className="px-2 flex flex-row gap-2">
        {children}
    </div>
}

type EditControlButtonProps = {
    setEditing?: (isEditing: boolean) => void
    onDelete?: () => void
    onShow?: () => void
    loading?: boolean
    otherButtons?: ReactNode | ReactNode[]
}

export const EditControlButtons = ({ setEditing, onDelete, onShow, loading, otherButtons }: EditControlButtonProps) => {
    return <ControlButtonContainer>
        {setEditing &&
            <IconButton
                size="small"
                onClick={() => setEditing(true)}
                loading={loading}
            >
                <Edit />
            </IconButton>
        }
        {onDelete &&
            <IconButton
                size="small"
                onClick={onDelete}
                loading={loading}
            >
                <Delete />
            </IconButton>
        }
        {onShow &&
            <IconButton
                size="small"
                onClick={onShow}
                loading={loading}
            >
                <Visibility />
            </IconButton>
        }
        {otherButtons}
    </ControlButtonContainer>
}

type EditingControlButtonProps = {
    loading?: boolean
    setEditing: (isEditing: boolean) => void
    onSave: () => void
}

export const EditingControlButtons = ({ setEditing, onSave, loading }: EditingControlButtonProps) => {
    return <ControlButtonContainer>
        <IconButton
            onClick={onSave}
            size="small"
            loading={loading}
        >
            <Check />
        </IconButton >
        <IconButton
            onClick={() => setEditing(false)}
            loading={loading}
            size="small"
        >
            <Close />
        </IconButton>
    </ControlButtonContainer>
}
