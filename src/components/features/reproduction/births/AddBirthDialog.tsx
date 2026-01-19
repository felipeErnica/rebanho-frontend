import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
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
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { FormRadioGroup } from "@shared/form-controls/FormRadioGroup"
import { DialogActionButtons, DialogContainer, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { useCallback, useEffect, useState } from "react"
import { addBirth, addBirthNoValidation, getBirthFather, replaceBirth } from "./Controller"
import { APIError } from "@utils/ApiRequest"
import { CONFLICT_WARNING, DefaultWarning, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { searchAnimal } from "@features/animals/Service"
import { Animal } from "@features/animals/Entities"

type AddBirthDialogProps = {
    addBirthOpen: boolean
    closeBirthDialog: (added?: boolean) => void
}

export const AddBirthDialog = ({ addBirthOpen, closeBirthDialog }: AddBirthDialogProps) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<YesNoDialogProps>(DefaultWarning)
    const [added, setAdded] = useState(false)

    const [fathers, setFathers] = useState<Animal[]>([])
    const [mothers, setMothers] = useState<Animal[]>([])

    const { handleSubmit, control, reset, setValue, getValues } = useForm<BirthEntrySave>()

    useEffect(() => {
        setLoading(true)
        Promise.all([
            searchAnimal({ isFiltered: true, sex: 'F', types: ['REPRODUCTION_ANIMAL'] }),
            searchAnimal({ isFiltered: true, sex: 'M', types: ['REPRODUCTION_ANIMAL'] }),
        ])
            .then(values => {
                setMothers(values[0])
                setFathers(values[1])
            })
            .catch(() => {
                setFathers([])
                setMothers([])
            })
            .finally(() => setLoading(false))
    }, [])

    const onClose = useCallback(() => {
        reset()
        setError(undefined)
        setWarning(DefaultWarning)
        closeBirthDialog(added)
    }, [added, closeBirthDialog, reset])

    const onSave: SubmitHandler<BirthEntrySave> = (data: BirthEntrySave) => {
        setLoading(true)
        addBirth(data)
            .then(() => {
                setError(undefined)
                setWarning(DefaultWarning)
                setAdded(true)
                reset()
            })
            .catch((err: APIError) => {
                if (err.kind == CONFLICT_WARNING) {
                    setWarning({
                        openYesNo: true,
                        title: err.title,
                        message: err.message,
                        onClose: () => setWarning(DefaultWarning),
                        onYes: handleSubmit(onAddNoValidation)
                    })
                    return
                }
                if (err.kind == 'RingWarning') {
                    setWarning({
                        openYesNo: true,
                        title: err.title,
                        message: err.message,
                        onClose: () => setWarning(DefaultWarning),
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
                setWarning(DefaultWarning)
                setAdded(true)
            })
            .catch((err: APIError) => {
                setError(err)
                setWarning(DefaultWarning)
            })
    }

    const onAddNoValidation: SubmitHandler<BirthEntrySave> = (data: BirthEntrySave) => {
        addBirthNoValidation(data)
            .then(() => {
                reset()
                setError(undefined)
                setWarning(DefaultWarning)
                setAdded(true)
            })
            .catch((err: APIError) => {
                setError(err)
                setWarning(DefaultWarning)
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
                    className="w-50"
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
                    className="w-50"
                    formProps={{ control, name: 'ringNumber' }}
                />
                <FormSearchBox
                    label="Mãe*"
                    options={mothers.map(item => ({
                        id: item.id,
                        label: [item.ringNumber, item.name].join(' - ')
                    }))}
                    className="w-100"
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
                    options={fathers.map(item => ({
                        id: item.id,
                        label: [item.ringNumber, item.name].join(' - ')
                    }))}
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
