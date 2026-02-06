import {
    DialogActionButtons,
    DialogContainer,
    ErrorDialog,
    YesNoDialog,
} from "@shared/dialog/DialogComponents"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { APIError } from "@utils/ApiRequest"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Collapse from "@mui/material/Collapse"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { useEffect, useState } from "react"
import { Control, SubmitHandler, useForm, UseFormSetValue } from "react-hook-form"
import { Animal, AnimalSave, getAnimalLabel } from "./Entities"
import {
    addAnimal,
    searchAnimal,
    updateAnimal,
} from "./Service"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormCheckboxGroup } from "@shared/form-controls/FormCheckbox"
import { RadioComponent } from "@shared/common/RadioComponent"

type AddBullDialogProps = {
    addBullOpen: boolean
    closeAddBull: (added?: boolean) => void
    isInseminationBull?: boolean
    isTransferBull?: boolean
    isBreedingBull?: boolean
    isOutsideAnimal?: boolean
}

export const AddBullDialog = ({
    addBullOpen,
    closeAddBull,
    isBreedingBull,
    isTransferBull,
    isInseminationBull,
    isOutsideAnimal
}: AddBullDialogProps) => {

    const { handleSubmit, control, reset, resetField, setValue } = useForm<AnimalSave>({
        defaultValues: {
            isBreedingBull,
            isTransferBull,
            isInseminationBull,
            isOutsideAnimal
        }
    })

    const [formType, setFormType] = useState('newAnimal')
    const [error, setError] = useState<APIError>()
    const [added, setAdded] = useState(false)
    const [warning, setWarning] = useState<APIError>()
    const [loading, setLoading] = useState(false)
    const [externalAnimal, setExternalAnimal] = useState(false)

    const onUpdate: SubmitHandler<AnimalSave> = (data: AnimalSave) => {
        const entry: AnimalSave = {
            ...data,
            sex: 'M',
            animalType: 'REPRODUCTION_ANIMAL',
        }
        setLoading(true)
        updateAnimal(entry)
            .then(() => {
                setAdded(true)
                setError(undefined)
                setWarning(undefined)
                reset()
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                } else {
                    setWarning(err)
                }
            })
            .finally(() => setLoading(false))
    }

    const onSubmit: SubmitHandler<AnimalSave> = (data: AnimalSave) => {

        if (formType == 'cattleAnimal') {
            onUpdate(data)
            return
        }

        const entry: AnimalSave = {
            ...data,
            sex: 'M',
            animalType: 'REPRODUCTION_ANIMAL',
        }
        setLoading(true)
        addAnimal(entry)
            .then(() => {
                setAdded(true)
                setError(undefined)
                setWarning(undefined)
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                } else {
                    setWarning(err)
                }
            })
            .finally(() => setLoading(false))
    }

    return <Dialog
        open={addBullOpen}
        onClose={() => {
            reset()
            closeAddBull(added)
        }}
    >
        <DialogTitle>Adicionar Touro</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert severity="error" onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <RadioComponent
                    value={formType}
                    row
                    onChange={(_, value) => {
                        resetField('id')
                        resetField('fatherId')
                        resetField('motherId')
                        resetField('birthDate')
                        resetField('weaningDate')
                        resetField('observation')
                        resetField('weightBirth')
                        resetField('isOutsideAnimal')
                        setExternalAnimal(false)
                        setFormType(value)
                    }}
                    controls={[
                        { label: 'Novo Animal', value: 'newAnimal' },
                        { label: 'Animal do Rebanho', value: 'cattleAnimal' }
                    ]}
                />
                <FormBody {...{ formType, control, externalAnimal, setValue }} />
                <FormTextField
                    label="Observações"
                    variant="outlined"
                    formProps={{ control, name: 'observation' }}
                    multiline
                    maxRows={5}
                    rows={5}
                />
                <FormCheckboxGroup
                    label="Informações Extras"
                    row
                    controls={[
                        {
                            label: 'Touro de Inseminação',
                            formProps: { control, name: 'isInseminationBull', }
                        },
                        {
                            label: 'Touro de Cobertura',
                            formProps: { control, name: 'isBreedingBull' }
                        },
                        {
                            label: 'Animal Externo',
                            onChange: (_, value) => setExternalAnimal(value),
                            formProps: {
                                control,
                                disabled: formType === 'cattleAnimal',
                                name: 'isOutsideAnimal'
                            }
                        },
                        {
                            label: 'Touro p/ Transferência Embrionária',
                            formProps: { control, name: 'isTransferBull' }
                        },
                    ]}
                />
            </DialogContainer>
            <ErrorDialog
                openError={!!error}
                title={error?.title}
                message={error?.message}
                onClose={() => setError(undefined)}
            />
            <YesNoDialog
                openYesNo={!!warning}
                title={warning?.title}
                message={warning?.message}
                onClose={() => setWarning(undefined)}
                onYes={() => setValue('ignoreDead', true)}
            />
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                onSave={handleSubmit(onSubmit)}
                saveText="Adicionar"
                onClose={() => {
                    reset()
                    closeAddBull(added)
                }}
            />
        </DialogActions>
    </Dialog>

}

type FormBodyProps = {
    formType: string
    setValue: UseFormSetValue<AnimalSave>
    externalAnimal: boolean
    control: Control<AnimalSave, any, AnimalSave>
}

const FormBody = ({ formType, control, externalAnimal, setValue }: FormBodyProps) => {

    const [loading, setLoading] = useState(false)
    const [fathers, setFathers] = useState<Animal[]>([])
    const [mothers, setMothers] = useState<Animal[]>([])
    const [children, setChildren] = useState<Animal[]>([])

    useEffect(() => {
        setLoading(true)
        Promise.all([
            searchAnimal({ isFiltered: true, sex: 'F', types: ['REPRODUCTION_ANIMAL', 'DAIRY_ANIMAL'] }),
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

    if (formType === 'cattleAnimal') {
        return <>
            <FormSearchBox
                label="*Mãe"
                loading={loading}
                options={mothers.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
                onChange={(id) => {
                    if (!id) return
                    searchAnimal({ isFiltered: true, sex: 'M', mothers: [id] }, 'birth_date')
                        .then(res => setChildren(res))
                        .catch(() => setChildren([]))
                }}
                formProps={{
                    control,
                    name: 'motherId',
                    rules: { required: REQUIRED_FIELD_MSG }
                }}
            />
            <FormSearchBox
                label="*Animal"
                loading={loading}
                options={children.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
                onChange={(id) => {
                    if (!id) return
                    const animal = children.find(item => item.id === id)
                    setValue('fatherId', animal.fatherId)
                    setValue('birthDate', animal.birthDate)
                    setValue('weaningDate', animal.weaningDate)
                    setValue('weightBirth', animal.weightBirth)
                    setValue('observation', animal.observation)
                }}
                formProps={{
                    control,
                    name: 'id',
                    rules: { required: REQUIRED_FIELD_MSG }
                }}
            />
            <div className="flex flex-row gap-4">
                <FormTextField
                    className="w-[200px]"
                    label="*Brinco"
                    formProps={{
                        control,
                        name: 'ringNumber',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormTextField
                    className="w-[400px]"
                    label="*Nome"
                    formProps={{
                        control,
                        name: 'name',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
            </div >
        </>
    }

    return <>
        <div className="flex flex-row gap-4">
            <FormTextField
                className="w-[200px]"
                label="*Brinco"
                formProps={{
                    control,
                    name: 'ringNumber',
                    disabled: externalAnimal,
                    rules: { required: REQUIRED_FIELD_MSG }
                }}
            />
            <FormTextField
                className="w-[400px]"
                label="*Nome"
                formProps={{
                    control,
                    name: 'name',
                    rules: { required: REQUIRED_FIELD_MSG }
                }}
            />
        </div >
        <FormSearchBox
            label="Pai"
            loading={loading}
            formProps={{ control, name: 'fatherId' }}
            options={fathers.map(item => ({
                id: item.id,
                label: getAnimalLabel(item)
            }))}
        />
        <FormSearchBox
            label="Mãe"
            loading={loading}
            onChange={(id) => {
                if (!id) return
                searchAnimal({ isFiltered: true, sex: 'M', mothers: [id] }, 'birth_date')
                    .then(res => setChildren(res))
                    .catch(() => setChildren([]))
            }}
            formProps={{ control, name: 'motherId' }}
            options={mothers.map(item => ({
                id: item.id,
                label: getAnimalLabel(item)
            }))}
        />
        <FormDatePicker
            className="w-[200px]"
            label="Data de Nascimento"
            formProps={{ control, name: 'birthDate' }}
        />
        <FormTextField
            className="w-[200px]"
            type="number"
            label="Peso do Animal"
            formProps={{ control, name: 'weightBirth' }}
        />
    </>

}
