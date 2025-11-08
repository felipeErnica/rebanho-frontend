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
import { SubmitHandler, useForm } from "react-hook-form"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@/ui/shared/dialog/DialogComponents"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { CONNECTION_ERROR, API_WARNING, REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchDairyAnimal, searchPastures } from "@/shared/GlobalApiCalls"
import { useCallback, useEffect, useState } from "react"
import { AddMilkEntryType } from "./Entities"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { APIError } from "@/util/ApiRequest"
import { addMilkEntry, replaceMilkEntry } from "./Controller"

type AddTestDialogProps = {
    addMilkEntryOpen: boolean
    onClose: (added: boolean) => void
    entryDate?: Date
}

export const AddMilkEntryDialog = ({ addMilkEntryOpen, onClose, entryDate }: AddTestDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()
    const [loading, setLoading] = useState(false)
    const [resetFlag, setResetFlag] = useState(0)
    const [added, setAdded] = useState(false)
    const [noPasture, setNoPasture] = useState(false)

    const { handleSubmit, control, reset, setValue, getValues, setFocus } = useForm<AddMilkEntryType>({
        defaultValues: { entryDate }
    })

    useEffect(() => setValue('entryDate', entryDate), [setValue, entryDate])

    useEffect(() => {
        reset({ entryDate: getValues('entryDate') })
        setFocus('animalId')
    }, [getValues, reset, resetFlag, setFocus])

    const errHandling = useCallback((err: APIError) => {
        if (err.kind === API_WARNING) {
            setWarning(err)
            return
        }
        setError(err)
        return
    }, [])

    const onSubmit: SubmitHandler<AddMilkEntryType> = (data: AddMilkEntryType) => {
        data.quantity = Number(data.quantity)
        addMilkEntry(data)
            .then(response => {
                if (response.error) {
                    errHandling(response.json)
                    return
                }
                setAdded(true)
                setError(undefined)
                reset({ entryDate: data.entryDate, pastureId: data.pastureId })
                setFocus('animalId')
            })
            .catch(() => setError(CONNECTION_ERROR))
            .finally(() => setLoading(false))
    }

    const onReplace: SubmitHandler<AddMilkEntryType> = (data: AddMilkEntryType) => {
        replaceMilkEntry(data)
            .then(response => {
                if (response.error) {
                    setError(response.json)
                    return
                }
                setAdded(true)
                setError(undefined)
            })
            .catch(() => setError(CONNECTION_ERROR))
            .finally(() => {
                setResetFlag(prev => prev + 1)
                setWarning(undefined)
            })
    }

    const handleClose = () => {
        setWarning(undefined)
        setError(undefined)
        reset()
        onClose(added)
    }

    const alertOnClose = () => {
        setError(undefined)
    }

    return <Dialog
        open={addMilkEntryOpen}
        onClose={handleClose}
    >
        <DialogTitle>Adicionar Marcação de Leite</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={alertOnClose}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    label="Data de Marcação"
                    className="w-[200]"
                    disableFuture
                    formProps={{
                        control,
                        name: 'entryDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <div className="flex flex-col">
                    <FormSearchBox
                        label="Lote"
                        searchOptions={searchPastures}
                        formProps={{
                            control,
                            name: 'pastureId',
                            rules: { required: REQUIRED_FIELD_MSG },
                            disabled: noPasture
                        }}
                    />
                    <FormControlLabel
                        label="Sem Lote"
                        control={(
                            <Checkbox
                                checked={noPasture}
                                onChange={() => setNoPasture(prev => !prev)}
                            />
                        )}
                    />
                </div>
                <div className="flex flex-row gap-4">
                    <FormSearchBox
                        label="Vaca"
                        className="w-[400]"
                        searchOptions={searchDairyAnimal}
                        formProps={{
                            control,
                            rules: { required: REQUIRED_FIELD_MSG },
                            name: 'animalId'
                        }}
                    />
                    <FormTextField
                        label="Quantidade"
                        type="number"
                        className="w-[100]"
                        formProps={{
                            control,
                            name: 'quantity',
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}
                    />
                </div>
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                onClose={handleClose}
                onSave={handleSubmit(onSubmit)}
                saveText="Marcar Leite"
            />
        </DialogActions>
        <YesNoDialog
            title={warning?.title}
            content={warning?.message}
            onYes={handleSubmit(onReplace)}
            onClose={() => {
                setResetFlag(prev => prev + 1)
                setWarning(undefined)
            }}
            openYesNo={!!warning}
        />
    </Dialog>
}
