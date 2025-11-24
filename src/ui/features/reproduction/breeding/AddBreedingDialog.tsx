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
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { searchAllMothers } from "@/shared/GlobalApiCalls"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { useState } from "react"
import { addBreeding, searchBreedingBulls } from "./Controller"
import { APIError } from "@/util/ApiRequest"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@/ui/shared/dialog/DialogComponents"

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
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()

    const { control, handleSubmit, reset, setFocus } = useForm<BreedingEntrySave>({
        defaultValues: { bullId, breedingDate: breedingDate }
    })

    const onClose = () => {
        reset()
        closeAddBreeding(added)
    }

    const onReplace: SubmitHandler<BreedingEntrySave> = (data: BreedingEntrySave) => {
        setLoading(true)
        addBreeding(data)
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
        <DialogTitle>Adicionar Monta</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert severity="error" onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <FormDatePicker
                    className="w-[250]"
                    label="*Data de Monta"
                    formProps={{
                        control,
                        name: 'breedingDate',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Vaca"
                    className="w-[400]"
                    searchOptions={searchAllMothers}
                    formProps={{
                        control,
                        name: 'animalId',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Touro"
                    searchOptions={searchBreedingBulls}
                    formProps={{
                        control,
                        name: 'bullId',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormTextField
                    label="Observações"
                    multiline
                    rows={3}
                    maxRows={5}
                    formProps={{ control, name: 'observation' }}
                />
            </DialogContainer>
            <YesNoDialog
                openYesNo={!!warning}
                title={warning?.title}
                content={warning?.message}
                onYes={handleSubmit(onReplace)}
                onClose={() => setWarning(undefined)}
            />
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
