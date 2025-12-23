    import { DialogActionButtons, DialogContainer } from "@shared/dialog/DialogComponents"
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
    import { searchLactating, updateEndDate } from "./Controller"
    import { useForm } from "react-hook-form"
    import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
    import { APIError } from "@utils/ApiRequest"
    import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
    import { AddLactationStruct } from "./Entities"
import { searchPastures } from "@utils/GlobalApiCalls"
import { REQUIRED_FIELD_MSG } from "@shared/Globals"

type EndLactationDialogProps = {
    openEndLactation: boolean
    closeEndLactation: (changed?: boolean) => void
}

export const EndLactationDialog = ({ openEndLactation, closeEndLactation }: EndLactationDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [noPasture, setNoPasture] = useState(false)
    const [changed, setChanged] = useState(false)
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, reset } = useForm<AddLactationStruct>()

    const onSubmit = useCallback((data: AddLactationStruct) => {
        setLoading(true)
        updateEndDate(data)
            .then(() => {
                reset({ endDate: data.endDate })
                setChanged(true)
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    }, [reset])

    const onSave = handleSubmit(onSubmit)

    return <Dialog open={openEndLactation} onClose={() => closeEndLactation(changed)}>
        <DialogTitle>Secar Vacas</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    className="w-[200px]"
                    label="Data da Secagem"
                    disableFuture
                    formProps={{ control, name: 'endDate' }}
                />
                <div className="flex flex-col">
                    <FormSearchBox
                        label="Transferir para"
                        searchOptions={searchPastures}
                        formProps={{
                            control,
                            name: 'pastureId',
                            disabled: noPasture,
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}

                    />
                    <FormControlLabel
                        label="Não transferir"
                        control={(
                            <Checkbox
                                checked={noPasture}
                                onChange={() => setNoPasture(prev => !prev)}
                            />
                        )}
                    />
                </div>
                <FormSearchBox
                    formProps={{ control, name: 'id' }}
                    className="w-[400px]"
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
                    closeEndLactation(changed)
                }}
            />
        </DialogActions>
    </Dialog>

}
