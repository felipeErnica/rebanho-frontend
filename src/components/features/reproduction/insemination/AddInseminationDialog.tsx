import { AddBullDialog } from "@features/animals/AddBullDialog"
import { AddCowDialog } from "@features/animals/AddCowDialog"
import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { searchMothers } from "@features/animals/Service"
import { Alert, AlertTitle, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { APIError } from "@utils/ApiRequest"
import { useCallback, useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { AddInseminationBullDialog } from "./AddInseminationBull"
import { InseminationEntrySave } from "./Entities"
import { addInsemination, searchInseminationBulls } from "./Service"

type AddInseminationDialogProps = {
    addInseminationOpen: boolean
    closeAddInsemination: (added?: boolean) => void
    bullId?: string
    inseminationDate?: Date
}

export const AddInseminationDialog = ({
    addInseminationOpen,
    closeAddInsemination,
    bullId,
    inseminationDate
}: AddInseminationDialogProps) => {

    const [loading, setLoading] = useState(false)
    const [warning, setWarning] = useState<APIError>()
    const [error, setError] = useState<APIError>()
    const [added, setAdded] = useState(false)
    const [reload, setReload] = useState(0)

    const [bulls, setBulls] = useState<Animal[]>([])
    const [mothers, setMothers] = useState<Animal[]>([])

    const [addInseminationBull, setAddInseminationBull] = useState(false)
    const [addBullOpen, setAddBullOpen] = useState(false)
    const [addCowOpen, setAddCowOpen] = useState(false)

    const { control, handleSubmit, reset, setFocus, setValue } = useForm<InseminationEntrySave>({
        defaultValues: { bullId, inseminationDate }
    })

    useEffect(() => {
        if (!inseminationDate) return
        setValue('inseminationDate', inseminationDate)
    }, [inseminationDate, setValue])

    useEffect(() => {
        Promise.all([
            searchInseminationBulls(),
            searchMothers()
        ])
            .then(resp => {
                setBulls(resp[0])
                setMothers(resp[1])
            })
            .catch(() => {
                setBulls([])
                setMothers([])
            })
    }, [reload])

    const onClose = useCallback(() => {
        reset()
        closeAddInsemination(added)
    }, [added, closeAddInsemination, reset])

    const closeAddInseminationBull = (added?: boolean) => {
        if (added) setReload(prev => prev + 1)
        setAddInseminationBull(false)
    }

    const closeAddBull = (added?: boolean) => {
        if (added) setReload(prev => prev + 1)
        setAddBullOpen(false)
    }

    const closeAddCow = (added?: boolean) => {
        if (added) setReload(prev => prev + 1)
        setAddCowOpen(false)
    }

    const onSubmit: SubmitHandler<InseminationEntrySave> = (data: InseminationEntrySave) => {
        setLoading(true)
        addInsemination(data)
            .then(() => {
                reset({
                    inseminationDate: data.inseminationDate,
                    bullId: data.bullId
                })
                setFocus('animalId')
                setWarning(undefined)
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

    return <Dialog
        open={addInseminationOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Inseminação</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert severity="error" onClose={() => setError(undefined)}>
                        <AlertTitle title={error?.title} />
                        {error?.message}
                    </Alert>
                </Collapse>
                <FormDatePicker
                    className="w-[200px]"
                    label="*Data de Inseminação"
                    formProps={{
                        control,
                        name: 'inseminationDate',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Touro"
                    options={bulls.map(item => ({
                        id: item.id,
                        label: getAnimalLabel(item)
                    }))}
                    emptyProps={[
                        {
                            id: 'addExistingBull',
                            title: '+ Adicionar Touro como Touro de Inseminação',
                            onEmpty: () => setAddInseminationBull(true)
                        },
                        {
                            id: 'newBull',
                            title: '+ Adicionar Novo Touro',
                            onEmpty: () => setAddBullOpen(true)
                        }
                    ]}
                    formProps={{
                        control,
                        name: 'bullId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="*Vaca"
                    className="w-[400px]"
                    options={mothers.map(item => ({
                        id: item.id,
                        label: getAnimalLabel(item)
                    }))}
                    emptyProps={[{
                        id: 'newCow',
                        title: '+ Adicionar Vaca',
                        onEmpty: () => setAddCowOpen(true)
                    }]}
                    formProps={{
                        control,
                        name: 'animalId',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormTextField
                    label="Observações"
                    variant="outlined"
                    multiline
                    rows={5}
                    maxRows={5}
                    formProps={{
                        control,
                        name: 'observation'
                    }}
                />
            </DialogContainer>
            <AddInseminationBullDialog {...{ addInseminationBull, closeAddInseminationBull }} />
            <AddBullDialog {...{ addBullOpen, closeAddBull, isInseminationBull: true }} />
            <AddCowDialog {...{ addCowOpen, closeAddCow }} />
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Adicionar"
                onSave={handleSubmit(onSubmit)}
                onClose={onClose}
            />
        </DialogActions>
        <YesNoDialog
            openYesNo={!!warning}
            title={warning?.title}
            message={warning?.message}
            onYes={() => {
                setValue('overwrite', true)
                handleSubmit(onSubmit)
            }}
            onClose={() => setWarning(undefined)}
        />
    </Dialog>
}
