import { DialogActionButtons, DialogContainer } from "@/ui/shared/dialog/DialogComponents"
import {
    Alert,
    AlertTitle,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material"
import { useCallback, useState } from "react"
import { addLactation, searchDryAnimals } from "./Controller"
import { useForm } from "react-hook-form"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { APIError } from "@/util/ApiRequest"
import { API_WARNING, ConnectionError } from "@/ui/shared/Globals"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { AddLactationStruct } from "./Entities"

type StartLacDialogProps = {
    openStartLac: boolean
    closeStartLac: () => void
}

export const StartLacDialog = ({ openStartLac, closeStartLac }: StartLacDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, reset } = useForm<AddLactationStruct>()

    const errHandling = useCallback((err: APIError) => {
        if (err.kind == API_WARNING) {
            return
        }
        setError(err)
    }, [])

    const onSubmit = useCallback((data: AddLactationStruct) => {
        setLoading(true)
        addLactation(data)
            .then(response => {
                if (response.error) {
                    errHandling(response.json)
                    return
                }
                reset({ startDate: data.startDate })
            })
            .catch(() => setError(ConnectionError))
            .finally(() => setLoading(false))
    }, [errHandling, reset])

    const onSave = handleSubmit(onSubmit)

    return <Dialog open={openStartLac}>
        <DialogTitle>Iniciar Lactações</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error">
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer className="flex flex-col overflow-hidden">
                <FormDatePicker
                    className="w-[200]"
                    label="Data de Início"
                    formProps={{ control, name: 'startDate' }}
                />
                <FormSearchBox
                    formProps={{ control, name: 'animalId' }}
                    label="Vaca"
                    searchOptions={searchDryAnimals}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Iniciar"
                onSave={onSave}
                onClose={() => {
                    reset()
                    closeStartLac()
                }}
            />
        </DialogActions>
    </Dialog>

}
