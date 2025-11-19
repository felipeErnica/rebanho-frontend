import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
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
import { BirthEntrySave } from "./Entities"
import { searchFather, searchOwnedMothers } from "@/shared/GlobalApiCalls"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { FormRadioGroup } from "@/ui/shared/form-controls/FormRadioGroup"
import { DialogActionButtons, DialogContainer, YesNoDialog, YesNoDialogProps } from "@/ui/shared/dialog/DialogComponents"
import { useCallback, useMemo, useState } from "react"
import { addBirth, addBirthNoValidation, getBirthFather, replaceBirth } from "./Controller"
import { APIError } from "@/util/ApiRequest"
import { CONFLICT_WARNING, REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"

type AddBirthDialogProps = {
    addBirthOpen: boolean
    closeBirthDialog: (added?: boolean) => void
}

export const AddBirthDialog = ({ addBirthOpen, closeBirthDialog }: AddBirthDialogProps) => {

    const defaultWarning: YesNoDialogProps = useMemo(() => ({
        openYesNo: false,
        title: undefined,
        content: undefined,
        onYes: undefined,
        onClose: undefined
    }), [])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<YesNoDialogProps>(defaultWarning)
    const [added, setAdded] = useState(false)

    const { handleSubmit, control, reset, setValue, getValues } = useForm<BirthEntrySave>()

    const onClose = useCallback(() => {
        reset()
        setError(undefined)
        setWarning(defaultWarning)
        closeBirthDialog(added)
    }, [added, closeBirthDialog, defaultWarning, reset])

    const onSave: SubmitHandler<BirthEntrySave> = (data: BirthEntrySave) => {
        setLoading(true)
        addBirth(data)
            .then(() => {
                setError(undefined)
                setWarning(defaultWarning)
                setAdded(true)
                reset()
            })
            .catch((err: APIError) => {
                if (err.kind == CONFLICT_WARNING) {
                    setWarning({
                        openYesNo: true,
                        title: err.title,
                        content: err.message,
                        onClose: () => setWarning(defaultWarning),
                        onYes: handleSubmit(onAddNoValidation)
                    })
                    return
                }
                if (err.kind == 'RingWarning') {
                    setWarning({
                        openYesNo: true,
                        title: err.title,
                        content: err.message,
                        onClose: () => setWarning(defaultWarning),
                        onYes: handleSubmit(onReplace)
                    })
                    return
                }
                setError(err)
            })
            .finally(() => setLoading(false))
    }

    const onReplace: SubmitHandler<BirthEntrySave> = (data: BirthEntrySave) => {
        replaceBirth(data)
            .then(() => {
                reset()
                setError(undefined)
                setWarning(defaultWarning)
                setAdded(true)
            })
            .catch((err: APIError) => {
                setError(err)
                setWarning(defaultWarning)
            })
    }

    const onAddNoValidation: SubmitHandler<BirthEntrySave> = (data: BirthEntrySave) => {
        addBirthNoValidation(data)
            .then(() => {
                reset()
                setError(undefined)
                setWarning(defaultWarning)
                setAdded(true)
            })
            .catch((err: APIError) => {
                setError(err)
                setWarning(defaultWarning)
            })
    }

    const getFatherId = () => {
        const motherId = getValues('motherId')
        const birthDate = getValues('birthDate')

        if (!motherId || !birthDate) return

        const entry: BirthEntrySave = {
            birthDate: birthDate,
            motherId: motherId
        }

        getBirthFather(entry).then((response: BirthEntrySave) => setValue('fatherId', response.fatherId))
    }

    return <Dialog
        open={addBirthOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Parição</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    label="Data de Nascimento*"
                    className="w-[200]"
                    onBlur={getFatherId}
                    disableFuture
                    formProps={{
                        control,
                        name: 'birthDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormTextField
                    label="Brinco"
                    className="w-[200]"
                    formProps={{ control, name: 'ringNumber' }}
                />
                <FormSearchBox
                    label="Mãe*"
                    className="w-[400]"
                    searchOptions={searchOwnedMothers}
                    onChange={getFatherId}
                    formProps={{
                        control,
                        name: 'motherId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormRadioGroup
                    label="Sexo*"
                    row
                    controls={[{ label: 'Macho', value: 'M' }, { label: 'Fêmea', value: 'F' }]}
                    formProps={{
                        control,
                        name: 'sex',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Pai*"
                    searchOptions={searchFather}
                    formProps={{
                        control,
                        name: 'fatherId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormTextField
                    label="Observações da Parição"
                    variant="outlined"
                    multiline
                    rows={5}
                    formProps={{ control, name: 'observation' }}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                onSave={handleSubmit(onSave)}
                onClose={onClose}
                saveText="Adicionar"
            />
        </DialogActions>
        <YesNoDialog {...warning} />
    </Dialog>
}
