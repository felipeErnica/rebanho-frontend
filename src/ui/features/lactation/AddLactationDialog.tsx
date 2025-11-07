import { DialogActionButtons } from "@/ui/shared/dialog/DialogComponents"
import {
    Alert,
    AlertTitle,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
} from "@mui/material"
import { useCallback, useState } from "react"
import { addLactation, searchCalfs, searchDryAnimals } from "./Controller"
import { useForm } from "react-hook-form"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { APIError } from "@/util/ApiRequest"
import { API_WARNING, ConnectionError, REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { AddLactationStruct } from "./Entities"

type StartLacDialogProps = {
    openStartLac: boolean
    closeStartLac: () => void
}

export const AddLacDialog = ({ openStartLac, closeStartLac }: StartLacDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [loading, setLoading] = useState(false)
    const [noBirth, setNoBirth] = useState(false)

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
                setError(undefined)
            })
            .catch(() => setError(ConnectionError))
            .finally(() => setLoading(false))
    }, [errHandling, reset])

    const onSave = handleSubmit(onSubmit)

    return <Dialog open={openStartLac}>
        <DialogTitle>Adicionar Novas Lactações</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <div className="flex flex-col gap-8 p-4">
                <FormDatePicker
                    label="Data de Início"
                    className="w-[200]"
                    formProps={{
                        control,
                        name: 'startDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    formProps={{
                        control,
                        name: 'animalId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                    label="Vaca"
                    className="w-[400]"
                    searchOptions={searchDryAnimals}
                />
                <div className="flex flex-col">
                    <FormSearchBox
                        formProps={{
                            disabled: noBirth,
                            control,
                            name: 'calfId',
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}
                        label="Bezerro"
                        className="w-[400]"
                        searchOptions={searchCalfs}
                    />
                    <FormControlLabel
                        className="col-span-2"
                        label="Lactação s/ Bezerro"
                        control={(
                            <Checkbox
                                checked={noBirth}
                                onChange={() => setNoBirth(prev => !prev)}
                            />
                        )}
                    />
                </div>
            </div>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Adicionar"
                onSave={onSave}
                onClose={() => {
                    reset()
                    closeStartLac()
                }}
            />
        </DialogActions>
    </Dialog>

}
