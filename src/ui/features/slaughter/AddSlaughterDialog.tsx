import { SubmitHandler, useForm } from "react-hook-form"
import { SlaughterEntrySave } from "./Entities"
import { Alert, AlertTitle, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useEffect, useState } from "react"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { addSlaughter, replaceSlaughter, searchButcher } from "./Controller"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@/ui/shared/dialog/DialogComponents"
import { searchAnimal } from "@/shared/GlobalApiCalls"
import { APIError } from "@/util/ApiRequest"
import { AddButcherDialog } from "./AddButcherDialog"

type AddSlaughterDialogProps = {
    addSlaughterOpen: boolean
    closeAddSlaughter: (added?: boolean) => void
    entryDate?: Date
}

export const AddSlaughterDialog = ({
    addSlaughterOpen,
    closeAddSlaughter,
    entryDate,
}: AddSlaughterDialogProps) => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const [addButcherOpen, setButcherOpen] = useState(false)

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()

    const {
        control,
        handleSubmit,
        reset,
        setFocus,
        setValue
    } = useForm<SlaughterEntrySave>({ defaultValues: { entryDate } })

    useEffect(() => {
        if (!entryDate) return
        setValue('entryDate', new Date(entryDate))
    }, [entryDate, setValue])

    const closeAddButcher = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setButcherOpen(false)
    }

    const onSave: SubmitHandler<SlaughterEntrySave> = (data: SlaughterEntrySave) => {
        setLoading(true)
        addSlaughter(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                reset({
                    entryDate: data.entryDate,
                    butcherId: data.butcherId,
                    discountRate: data.discountRate
                })
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

    const onReplace: SubmitHandler<SlaughterEntrySave> = (data: SlaughterEntrySave) => {
        setLoading(true)
        replaceSlaughter(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                reset({
                    entryDate: data.entryDate,
                    butcherId: data.butcherId,
                    discountRate: data.discountRate
                })
                setFocus('animalId')
                setAdded(true)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    return <Dialog
        open={addSlaughterOpen}
        onClose={() => closeAddSlaughter(added)}
    >
        <DialogTitle>Adicionar Abate</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <FormDatePicker
                    label="*Data de Abate"
                    className="w-[300]"
                    formProps={{
                        control,
                        name: 'entryDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormTextField
                    label="*Desconto de Peso"
                    className="w-[300]"
                    type="number"
                    formProps={{
                        control,
                        name: 'discountRate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="*Frigorífico"
                    reload={reloadFlag}
                    className="w-[500]"
                    searchOptions={searchButcher}
                    emptyProps={[{
                        id: "newSlaughterhouse",
                        title: '+ Novo Frigorífico',
                        onEmpty: () => setButcherOpen(true)
                    }]}
                    formProps={{
                        control,
                        name: 'butcherId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Animal"
                    searchOptions={searchAnimal}
                    formProps={{ control, name: 'animalId' }}
                />
                <FormTextField
                    className="w-[300]"
                    label="*Peso"
                    formProps={{ control, name: 'weight' }}
                    type="number"
                />
                <FormTextField
                    className="w-[300]"
                    label="Peso Morto"
                    formProps={{ control, name: 'deadWeight' }}
                    type="number"
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Adicionar"
                onSave={handleSubmit(onSave)}
                onClose={() => closeAddSlaughter(added)}
            />
        </DialogActions>
        <YesNoDialog
            openYesNo={!!warning}
            title={warning?.title}
            content={warning?.message}
            onClose={() => setWarning(undefined)}
            onYes={handleSubmit(onReplace)}
        />
        <AddButcherDialog {...{ addButcherOpen, closeAddButcher }} />
    </Dialog>

}
