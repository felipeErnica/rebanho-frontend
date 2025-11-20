import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
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
    return <div className={`flex flex-col gap-8 p-4 ${className}`}>
        {children}
    </div>
}

export type YesNoDialogProps = {
    loading?: boolean
    openYesNo: boolean
    title: string | undefined
    content: string | undefined
    yesTitle?: string
    onYes: (() => void) | undefined
    onClose: (() => void) | undefined
}

export const YesNoDialog = ({ 
    openYesNo, 
    content, 
    title, 
    onClose, 
    onYes, 
    loading 
}: YesNoDialogProps) => {

    if (!onYes || !onClose) return

    return <Dialog
        onClose={onClose}
        open={openYesNo}
        onKeyUp={(event) => {
            if (loading) return
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
            <div className="flex flex-row gap-4 items-center p-4">
                <Warning sx={{ fontSize: 60 }} color="warning" />
                <Typography className="whitespace-pre-wrap" fontSize={16} variant="body2">
                    {content ?? 'Sem Informações'}
                </Typography>
            </div>
        </DialogContent>
        <DialogActions>
            <Button
                loading={loading}
                autoFocus
                onClick={onYes}
            >
                Sim
            </Button>
            <Button 
                loading={loading}
                onClick={onClose}
            >
                Não
            </Button>
        </DialogActions>
    </Dialog>
}

export type TimerYesNoDialogProps = YesNoDialogProps & {
    waitTime: number
}

export const TimerYesNoDialog = ({ 
    waitTime,
    openYesNo, 
    content, 
    title, 
    onClose, 
    onYes, 
    loading 
}: TimerYesNoDialogProps) => {

    const [secondsLeft, setSecondsLeft] = useState(waitTime)

    useEffect(() => {
        if (openYesNo) setSecondsLeft(waitTime)
    }, [openYesNo, waitTime])

    useEffect(() => {
        if (secondsLeft < 0 ) return
        const timer = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000)
        return () => clearTimeout(timer)
    }, [secondsLeft, waitTime])

    if (!onYes || !onClose) return

    return <Dialog
        onClose={onClose}
        open={openYesNo}
        onKeyUp={(event) => {
            if (loading || secondsLeft > 0) return
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
            <div className="flex flex-row gap-4 items-center p-4">
                <Warning sx={{ fontSize: 60 }} color="warning" />
                <Typography className="whitespace-pre-wrap" fontSize={16} variant="body2">
                    {content ?? 'Sem Informações'}
                </Typography>
            </div>
        </DialogContent>
        <DialogActions>
            <Button
                loading={loading}
                disabled={secondsLeft > 0}
                autoFocus
                onClick={onYes}
            >
                {secondsLeft > 0 ? `Sim (${secondsLeft})` : 'Sim'}
            </Button>
            <Button 
                loading={loading}
                onClick={onClose}
            >
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
                <Typography className="whitespace-pre-wrap" fontSize={16} variant="body2">
                    {content ?? 'Sem Informações'}
                </Typography>
            </div>
        </DialogContent>
    </Dialog>

}
