import { SubmitHandler, useForm } from "react-hook-form"
import { Alert, AlertTitle, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { CONFLICT_WARNING, ERROR_TYPE, REQUIRED_FIELD_MSG, WARNING_TYPE } from "@shared/Globals"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { APIError } from "@utils/ApiRequest"
import { SlaughterSave } from "./Entities"
import { addSlaughter } from "./Service"
import { findButchers } from "@features/butchers/Service"
import { AddButcherDialog } from "@features/butchers/AddButcherDialog"
import { Butcher } from "@features/butchers/Entities"
import { Animal, getAnimalBirthLabel } from "@features/animals/Entities"
import { searchInternalAnimals } from "@features/animals/Service"
import { SearchBoxItem } from "@shared/dialog/SearchBox"
import { FormPercentageField } from "@shared/form-controls/FormPercentageField"

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

    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(0)
    const [added, setAdded] = useState(false)
    const [addButcherOpen, setButcherOpen] = useState(false)

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()

    const [loadingAnimals, setLoadingAnimals] = useState(false)
    const [animals, setAnimals] = useState<SearchBoxItem[]>([])

    const [loadingButchers, setLoadingButchers] = useState(false)
    const [butchers, setButchers] = useState<Butcher[]>([])

    const searchAnimals = useCallback(() => {
        setLoadingAnimals(true)
        searchInternalAnimals()
            .then((resp: Animal[]) => setAnimals(resp.map(item => ({
                id: item.id,
                label: getAnimalBirthLabel(item)
            }))))
            .catch(() => setAnimals([]))
            .finally(() => setLoadingAnimals(false))
    }, [])

    const searchButchers = useCallback(() => {
        setLoadingButchers(true)
        findButchers()
            .then(resp => setButchers(resp))
            .catch(() => setButchers([]))
            .finally(() => setLoadingButchers(false))
    }, [])

    const { control, handleSubmit, reset, setFocus, setValue } = useForm<SlaughterSave>({
        defaultValues: { entryDate, butcherId }
    })

    useEffect(() => {
        searchAnimals()
        searchButchers()
    }, [reload])

    useEffect(() => {
        if (entryDate) setValue('entryDate', new Date(entryDate))
        if (butcherId) setValue('butcherId', butcherId)
    }, [butcherId, entryDate])

    const closeAddButcher = useCallback((added: boolean) => {
        if (added) setReload(prev => prev + 1)
        setButcherOpen(false)
    }, [])

    const onSave: SubmitHandler<SlaughterSave> = useCallback((data: SlaughterSave) => {
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
                if (err.errType === ERROR_TYPE) setError(err)
                if (err.errType === WARNING_TYPE) setWarning(err)
            })
            .finally(() => setLoading(false))
    }, [])

    return <Dialog
        open={addSlaughterOpen}
        onClose={() => {
            reset()
            closeAddSlaughter(added)
        }}
    >
        <DialogTitle>Adicionar Abate</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert severity="error" onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <FormSearchBox
                    label="*Frigorífico"
                    className="w-[500px]"
                    loading={loadingButchers}
                    options={butchers.map(item => ({
                        id: item.id,
                        label: item.name
                    }))}
                    onChange={(id) => {
                        const butcher = butchers.find(item => item.id === id)
                        setValue('discountRate', butcher.discount)
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
                <FormPercentageField
                    label="*Taxa de Perda"
                    className="w-[100px]"
                    formProps={{
                        control,
                        name: 'discountRate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Animal"
                    loading={loadingAnimals}
                    options={animals}
                    onInput={(_, value) => {
                        if (!value) {
                            searchAnimals()
                            return
                        }
                        setAnimals(prev => prev.filter(item => item.label.startsWith(value)))
                    }}
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
                    endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
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
                    endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
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
            onYes={() => {
                if (warning.kind === CONFLICT_WARNING) setValue('overwrite', true)
                if (warning.kind === "death_warning") setValue('ignoreDeath', true)
                handleSubmit(onSave)
            }}
        />
        <AddButcherDialog {...{ addButcherOpen, closeAddButcher }} />
    </Dialog>

}
