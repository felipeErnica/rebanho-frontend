import {
    Alert,
    AlertTitle,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@/ui/shared/dialog/DialogComponents"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { ConnectionError, REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchDairyAnimal } from "@/shared/GlobalApiCalls"
import { useEffect, useState } from "react"
import { MilkEntry } from "./Entities"
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
    const [openYesNo, setOpenYesNo] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resetFlag, setResetFlag] = useState(0)
    const [added, setAdded] = useState(false)

    const { handleSubmit, control, reset, setValue, getValues, setFocus } = useForm<MilkEntry>({
        defaultValues: { entryDate }
    })

    useEffect(() => setValue('entryDate', entryDate), [setValue, entryDate])

    useEffect(() => {
        reset({ entryDate: getValues('entryDate') })
        setFocus('animalId')
    }, [getValues, reset, resetFlag, setFocus])

    const onSubmit: SubmitHandler<MilkEntry> = (data: MilkEntry) => {
        data.quantity = Number(data.quantity)
        addMilkEntry(data)
            .then(response => {
                if (response.status == 409) {
                    setError(undefined)
                    setOpenYesNo(true)
                    return
                }
                if (response.status != 201) {
                    setError(response.json)
                    return
                }
                setAdded(true)
                setError(undefined)
                reset({ entryDate: data.entryDate, quantity: undefined })
                setFocus('animalId')
            })
            .catch(() => setError(ConnectionError))
            .finally(() => setLoading(false))
    }

    const onReplace: SubmitHandler<MilkEntry> = (data: MilkEntry) => {
        data.quantity = Number(data.quantity)
        replaceMilkEntry(data)
            .then(response => {
                if (response.status != 200) {
                    setError(response.json)
                    return
                }
                setAdded(true)
                setError(undefined)
            })
            .catch(() => setError(ConnectionError))
            .finally(() => {
                setResetFlag(prev => prev + 1)
                setOpenYesNo(false)
            })
    }

    const handleClose = () => {
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
            <DialogContainer className="grid grid-flow-row gap-x-4 gap-y-8">
                <FormDatePicker
                    className="col-span-3"
                    label="Data de Marcação"
                    formProps={{
                        control,
                        name: 'entryDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Vaca"
                    className="col-span-2"
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
                    formProps={{
                        control,
                        name: 'quantity',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
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
            title={'Marcação já exite!'}
            content={"Esta marcação já existe! Deseja substituí-la?"}
            onYes={handleSubmit(onReplace)}
            onClose={() => {
                setResetFlag(prev => prev + 1)
                setOpenYesNo(false)
            }}
            openYesNo={openYesNo}
        />
    </Dialog>
}
