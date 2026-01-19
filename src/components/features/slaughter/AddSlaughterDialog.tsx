import { SubmitHandler, useForm } from "react-hook-form"
import { ButcherEntry, SlaughterEntrySave } from "./Entities"
import { Alert, AlertTitle, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useEffect, useState } from "react"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { addSlaughter, findButcherById, replaceSlaughter, searchButcher } from "./Controller"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { APIError } from "@utils/ApiRequest"
import { AddButcherDialog } from "./AddButcherDialog"

type AddSlaughterDialogProps = {
    addSlaughterOpen: boolean
    closeAddSlaughter: (added?: boolean) => void
    entryDate?: Date
    butcherId?: string
}

export const AddSlaughterDialog = ({
    addSlaughterOpen,
    closeAddSlaughter,
    entryDate,
    butcherId,
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
    } = useForm<SlaughterEntrySave>({ defaultValues: { entryDate, butcherId } })

    useEffect(() => {
        if (entryDate) setValue('entryDate', new Date(entryDate))
        if (butcherId) setValue('butcherId', butcherId)
    }, [butcherId, entryDate, setValue])

    const closeAddButcher = (added?: boolean) => {
        reset()
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
                <FormSearchBox
                    label="*Frigorífico"
                    reload={reloadFlag}
                    className="w-[500px]"
                    searchOptions={searchButcher}
                    onChange={(id) => {
                        findButcherById(id)
                            .then((response: ButcherEntry) => setValue('discountRate', response.discount))
                            .catch(() => setValue('discountRate', undefined))
                    }}
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
                <FormDatePicker
                    label="*Data de Abate"
                    className="w-[200px]"
                    formProps={{
                        control,
                        name: 'entryDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormTextField
                    label="*Taxa de Perda"
                    className="w-[200px]"
                    type="number"
                    formProps={{
                        control,
                        name: 'discountRate',
                        rules: { required: REQUIRED_FIELD_MSG, max: 100, min: 0 }
                    }}
                />
                <FormSearchBox
                    label="Animal"
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
                <FormTextField
                    className="w-[200px]"
                    label="Peso Morto"
                    formProps={{
                        control,
                        name: 'deadWeight',
                        rules: { min: 0 }
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
                onClose={() => closeAddSlaughter(added)}
            />
        </DialogActions>
        <YesNoDialog
            openYesNo={!!warning}
            title={warning?.title}
            message={warning?.message}
            onClose={() => setWarning(undefined)}
            onYes={handleSubmit(onReplace)}
        />
        <AddButcherDialog {...{ addButcherOpen, closeAddButcher }} />
    </Dialog>

}
