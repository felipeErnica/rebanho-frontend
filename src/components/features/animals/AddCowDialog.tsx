import {
    DialogActionButtons,
    DialogContainer,
    ErrorDialog,
    YesNoDialog,
} from "@shared/dialog/DialogComponents"
import { DefaultWarning, ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
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
import { Animal, AnimalSave } from "./Entities"
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
import { FormRadioGroup } from "@shared/form-controls/FormRadioGroup"

type AddCowDialogProps = {
    addCowOpen: boolean
    closeAddCow: (added?: boolean) => void
    isEmbryoDonor?: boolean
    isOutsideAnimal?: boolean
}

export const AddCowDialog = ({
    addCowOpen,
    closeAddCow,
    isOutsideAnimal,
    isEmbryoDonor,
}: AddCowDialogProps) => {

    const { handleSubmit, control, reset, resetField, setValue } = useForm<AnimalSave>({
        defaultValues: { isEmbryoDonor, isOutsideAnimal }
    })

    const [formType, setFormType] = useState('newAnimal')
    const [error, setError] = useState<APIError>()
    const [added, setAdded] = useState(false)
    const [warningProps, setWarningProps] = useState(DefaultWarning)
    const [loading, setLoading] = useState(false)

   const onUpdate: SubmitHandler<AnimalSave> = (data: AnimalSave) => {
        const entry: AnimalSave = {
            ...data,
            sex: 'F',
        }
        setLoading(true)
        updateAnimal(entry)
            .then(() => {
                setAdded(true)
                setError(undefined)
                setWarningProps(DefaultWarning)
                reset()
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
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
            sex: 'F',
        }
        setLoading(true)
        addAnimal(entry)
            .then(() => {
                setAdded(true)
                setError(undefined)
                setWarningProps(DefaultWarning)
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }
            })
            .finally(() => setLoading(false))
    }

    return <Dialog
        open={addCowOpen}
        onClose={() => {
            reset()
            closeAddCow(added)
        }}
    >
        <DialogTitle>Adicionar Vaca</DialogTitle>
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
                        setFormType(value)
                    }}
                    controls={[
                        { label: 'Novo Animal', value: 'newAnimal' },
                        { label: 'Animal do Rebanho', value: 'cattleAnimal' }
                    ]}
                />
                <FormBody {...{ formType, control, setValue }} />
                <FormRadioGroup
                    label="*Tipo de Vaca"
                    row
                    controls={[
                        { label: 'Leiteira', value: 'DAIRY_ANIMAL' },
                        { label: 'Matriz', value: 'REPRODUCTION_ANIMAL' }
                    ]}
                    formProps={{
                        control,
                        name: 'animalType',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormCheckboxGroup
                    label="Informações Extras"
                    row
                    controls={[
                        {
                            label: 'Doadora de Embrião',
                            formProps: { control, name: 'isEmbryoDonor', }
                        },
                        {
                            label: 'Animal Externo',
                            disabled: formType === 'cattleAnimal',
                            formProps: { control, name: 'isOutsideAnimal' }
                        },
                    ]}
                />
                <FormTextField
                    label="Observações"
                    variant="outlined"
                    formProps={{ control, name: 'observation' }}
                    multiline
                    maxRows={5}
                    rows={5}
                />
            </DialogContainer>
            <ErrorDialog
                openError={!!error}
                title={error?.title}
                message={error?.message}
                onClose={() => setError(undefined)}
            />
            <YesNoDialog {...warningProps} />
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                onSave={handleSubmit(onSubmit)}
                saveText="Adicionar"
                onClose={() => {
                    reset()
                    closeAddCow(added)
                }}
            />
        </DialogActions>
    </Dialog>

}

type FormBodyProps = {
    formType: string
    setValue: UseFormSetValue<AnimalSave>
    control: Control<AnimalSave, any, AnimalSave>
}

const FormBody = ({ formType, control, setValue }: FormBodyProps) => {

    const [loading, setLoading] = useState(false)
    const [fathers, setFathers] = useState<Animal[]>([])
    const [mothers, setMothers] = useState<Animal[]>([])
    const [children, setChildren] = useState<Animal[]>([])

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

    if (formType === 'cattleAnimal') {
        return <>
            <FormSearchBox
                label="*Mãe"
                loading={loading}
                onChange={(id) => {
                    searchAnimal({ isFiltered: true, mothers: [id], sex: 'F' })
                        .then(res => setChildren(res))
                        .catch(() => setChildren([]))
                }}
                options={mothers.map(item => ({
                    id: item.id,
                    label: [item.tag, item.name].join(' - ')
                }))}
                formProps={{
                    control,
                    name: 'motherId',
                    rules: { required: REQUIRED_FIELD_MSG }
                }}
            />
            <FormSearchBox
                label="*Animal"
                options={mothers.map(item => ({
                    id: item.id,
                    label: [item.tag, item.name].join(' - ')
                }))}
                onChange={(id) => {
                    if (!id) return
                    const animal = children.find(item => item.id === id)
                    setValue('fatherId', animal.father?.id)
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
        <FormSearchBox
            label="Pai"
            options={fathers.map(item => ({
                id: item.id,
                label: [item.tag, item.name].join(' - ')
            }))}
            formProps={{ control, name: 'fatherId' }}
        />
        <FormSearchBox
            label="Mãe"
            onChange={(id) => {
                searchAnimal({ isFiltered: true, mothers: [id], sex: 'F' })
                    .then(res => setChildren(res))
                    .catch(() => setChildren([]))
            }}
            options={mothers.map(item => ({
                id: item.id,
                label: [item.tag, item.name].join(' - ')
            }))}
            formProps={{
                control,
                name: 'motherId',
                rules: { required: false }
            }}
        />
    </>

}
