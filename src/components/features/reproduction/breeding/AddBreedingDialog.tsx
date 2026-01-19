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
import { BreedingEntrySave } from "./Entities"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { useState } from "react"
import { addBreeding, replaceBreeding, searchBreedingBulls } from "./Controller"
import { APIError } from "@utils/ApiRequest"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { AddBreddingBullDialog } from "./AddBreedingBull"
import { AddBullDialog } from "@features/animals/AddBullDialog"
import { AddCowDialog } from "@features/animals/AddCowDialog"

type AddBreeddingDialogProps = {
    addBreedingOpen: boolean
    closeAddBreeding: (added?: boolean) => void
    bullId?: string
    breedingDate?: Date
}

export const AddBreedingDialog = ({
    addBreedingOpen,
    closeAddBreeding,
    bullId,
    breedingDate
}: AddBreeddingDialogProps) => {

    const [added, setAdded] = useState(false)
    const [reload, setReload] = useState(0)
    const [loading, setLoading] = useState(false)
    const [addBreedingBull, setAddBreedingBull] = useState(false)
    const [addBullOpen, setAddBullOpen] = useState(false)
    const [addCowOpen, setAddCowOpen] = useState(false)

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()

    const { control, handleSubmit, reset, setFocus } = useForm<BreedingEntrySave>({
        defaultValues: { bullId, breedingDate }
    })

    const onClose = () => {
        reset()
        closeAddBreeding(added)
    }

    const closeAddBreedingBull = (added?: boolean) => {
        if (added) setReload(prev => prev + 1)
        setAddBreedingBull(false)
    }

    const closeAddBull = (added?: boolean) => {
        if (added) setReload(prev => prev + 1)
        setAddBullOpen(false)
    }

    const closeAddCow = (added?: boolean) => {
        if (added) setReload(prev => prev + 1)
        setAddCowOpen(false)
    }

    const onReplace: SubmitHandler<BreedingEntrySave> = (data: BreedingEntrySave) => {
        setLoading(true)
        replaceBreeding(data)
            .then(() => {
                setError(undefined)
                setAdded(true)
                reset({
                    breedingDate: data.breedingDate,
                    bullId: data.bullId
                })
                setFocus('animalId')
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoading(false)
                setWarning(undefined)
            })
    }

    const onSubmit: SubmitHandler<BreedingEntrySave> = (data: BreedingEntrySave) => {
        setLoading(true)
        addBreeding(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                setAdded(true)
                reset({
                    breedingDate: data.breedingDate,
                    bullId: data.bullId
                })
                setFocus('animalId')
            })
            .catch((err: APIError) => {
                if (err.errType == ERROR_TYPE) {
                    setError(err)
                    return
                }
                setWarning(err)
            })
            .finally(() => setLoading(false))
    }

    return <Dialog
        open={addBreedingOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Cobertura</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert severity="error" onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <FormDatePicker
                    className="w-[200px]"
                    label="*Data de Cobertura"
                    formProps={{
                        control,
                        name: 'breedingDate',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Touro"
                    searchOptions={searchBreedingBulls}
                    reload={reload}
                    emptyProps={[
                        {
                            id: 'addExistingBull',
                            title: '+ Adicionar Touro como Touro de Cobertura',
                            onEmpty: () => setAddBreedingBull(true)
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
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Vaca"
                    className="w-[400px]"
                    searchOptions={searchOwnedMothers}
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
                    formProps={{ control, name: 'observation' }}
                />
            </DialogContainer>
            <YesNoDialog
                openYesNo={!!warning}
                title={warning?.title}
                message={warning?.message}
                onYes={handleSubmit(onReplace)}
                onClose={() => setWarning(undefined)}
            />
            <AddBreddingBullDialog {...{ addBreedingBull, closeAddBreedingBull }} />
            <AddBullDialog {...{ addBullOpen, closeAddBull }} />
            <AddCowDialog {...{ addCowOpen, closeAddCow }} />
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                onClose={onClose}
                onSave={handleSubmit(onSubmit)}
                saveText="Adicionar"
                loading={loading}
            />
        </DialogActions>
    </Dialog>
}
