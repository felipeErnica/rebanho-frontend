import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { Dispatch, ReactNode, SetStateAction } from "react"
import Error from '@mui/icons-material/Error';
import Warning from '@mui/icons-material/Warning';

export interface AddDialogProps {
    addDialogOpen: boolean
    setAddDialogOpen: Dispatch<SetStateAction<boolean>>
}

type DialogActionButtonsProps = {
    onClose: () => void
    onSave: () => void
    saveText: string
    loading?: boolean
}

export const DialogActionButtons = ({ onClose, onSave, saveText, loading }: DialogActionButtonsProps) => {
    return <>
        <Button onClick={onSave} loading={loading}>
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
    return <div className={`w-[500] gap-8 p-4 ${className}`}>
        {children}
    </div>
}


type YesNoDialogProps = {
    openYesNo: boolean
    title: string | undefined
    content: string | undefined
    onYes: () => void
    onClose: () => void
}

export const YesNoDialog = ({ onYes, openYesNo, content, title, onClose }: YesNoDialogProps) => {

    return <Dialog
        onClose={onClose}
        open={openYesNo}
        onKeyUp={(event) => {
            switch (event.key) {
                case 's':
                    onYes()
                    break;
                case 'n':
                    onClose()
                    break;
            }
        }}
    >
        <DialogTitle>{title ?? 'AVISO: Informação Desconhecida'}</DialogTitle>
        <DialogContent>
            <div className="flex flex-row gap-8 items-center p-4">
                <Warning sx={{ fontSize: 60 }} color="warning" />
                <Typography fontSize={16} variant="body2">
                    {content ?? 'Sem Informações'}
                </Typography>
            </div>
        </DialogContent>
        <DialogActions>
            <Button
                autoFocus
                onClick={onYes}
            >
                Sim
            </Button>
            <Button onClick={onClose}>
                Não
            </Button>
        </DialogActions>
    </Dialog>
}

type ErrorDialogProps = {
    openError: boolean
    title: string | undefined
    content: string | undefined
    onClose: () => void
}

export const ErrorDialog = ({ onClose, openError, title, content }: ErrorDialogProps) => {
    return <Dialog
        open={openError}
        onClose={onClose}
    >
        <DialogTitle>{title ?? 'Desconhecido'}</DialogTitle>
        <DialogContent>
            <div className="flex flex-row gap-8 items-center p-4">
                <Error sx={{ fontSize: 60 }} color="error" />
                <Typography fontSize={16} variant="body2">
                    {content ?? 'Sem Informações'}
                </Typography>
            </div>
        </DialogContent>
    </Dialog>

}
