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
import { searchLactating, updateEndDate } from "./Controller"
import { useForm } from "react-hook-form"
import { UpdateLactationStruct } from "./Entities"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { APIError } from "@/util/ApiRequest"
import { CONNECTION_ERROR } from "@/ui/shared/Globals"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"

type EndLactationDialogProps = {
    openEndLactation: boolean
    closeEndLactation: () => void
}

export const EndLactationDialog = ({ openEndLactation, closeEndLactation }: EndLactationDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, reset } = useForm<UpdateLactationStruct>()

    const onSubmit = useCallback((data: UpdateLactationStruct) => {
        setLoading(true)
        updateEndDate(data)
            .then(response => {
                if (response.error) {
                    setError(response.json)
                    return
                }
                reset({ endDate: data.endDate })
            })
            .catch(() => setError(CONNECTION_ERROR))
            .finally(() => setLoading(false))
    }, [reset])

    const onSave = handleSubmit(onSubmit)

    return <Dialog open={openEndLactation}>
        <DialogTitle>Secar Vacas</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error">
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer className="flex flex-col overflow-hidden">
                <FormDatePicker
                    className="w-[250]"
                    label="Data do Fim da Lactação"
                    formProps={{ control, name: 'endDate' }}
                />
                <FormSearchBox
                    formProps={{ control, name: 'id' }}
                    label="Vaca"
                    searchOptions={searchLactating}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Secar Vacas"
                onSave={onSave}
                onClose={() => {
                    reset()
                    closeEndLactation()
                }}
            />
        </DialogActions>
    </Dialog>

}
