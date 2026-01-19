import { SubmitHandler, useForm } from "react-hook-form"
import { Alert, AlertTitle, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useEffect, useState } from "react"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { APIError } from "@utils/ApiRequest"
import { WeightEntrySave } from "./Entities"
import { addWeight, replaceWeight } from "./Controller"

type AddWeightDialogProps = {
    addWeightOpen: boolean
    closeAddWeight: (added?: boolean) => void
    entryDate?: Date
}

export const AddWeightDialog = ({
    addWeightOpen,
    closeAddWeight,
    entryDate,
}: AddWeightDialogProps) => {

    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()

    const {
        control,
        handleSubmit,
        reset,
        setFocus,
        setValue
    } = useForm<WeightEntrySave>({ defaultValues: { entryDate } })

    useEffect(() => {
        if (entryDate) setValue('entryDate', new Date(entryDate))
    }, [entryDate, setValue])

    const onSave: SubmitHandler<WeightEntrySave> = (data: WeightEntrySave) => {
        setLoading(true)
        addWeight(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                reset({ entryDate: data.entryDate })
                setFocus('animalId')
                setAdded(true)
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }
                setWarning(err)
            })
            .finally(() => setLoading(false))
    }

    const onReplace: SubmitHandler<WeightEntrySave> = (data: WeightEntrySave) => {
        setLoading(true)
        replaceWeight(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                reset({ entryDate: data.entryDate })
                setFocus('animalId')
                setAdded(true)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    return <Dialog
        open={addWeightOpen}
        onClose={() => closeAddWeight(added)}
    >
        <DialogTitle>Adicionar Pesagem</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <FormDatePicker
                    label="*Data de Pesagem"
                    className="w-[200px]"
                    formProps={{
                        control,
                        name: 'entryDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Animal"
                    className="w-[400px]"
                    searchOptions={searchAnimal}
                    formProps={{ control, name: 'animalId' }}
                />
                <FormTextField
                    className="w-[200px]"
                    label="*Peso"
                    formProps={{
                        control,
                        name: 'weight',
                        rules: { required: true, min: 0 }
                    }}
                    type="number"
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Adicionar"
                onSave={handleSubmit(onSave)}
                onClose={() => closeAddWeight(added)}
            />
        </DialogActions>
        <YesNoDialog
            openYesNo={!!warning}
            title={warning?.title}
            message={warning?.message}
            onClose={() => setWarning(undefined)}
            onYes={handleSubmit(onReplace)}
        />
    </Dialog>

}
