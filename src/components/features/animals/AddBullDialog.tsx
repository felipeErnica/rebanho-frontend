import { searchAllMothers, searchBulls } from "@utils/GlobalApiCalls"
import {
    DialogActionButtons,
    DialogContainer,
    ErrorDialog,
    YesNoDialog,
    YesNoDialogProps
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
import { useState } from "react"
import { Control, SubmitHandler, useForm, UseFormSetValue } from "react-hook-form"
import { Animal, AnimalSave } from "./Entities"
import {
    addAnimal,
    addNoValidation,
    findById,
    replaceAnimal,
    searchMaleChildren,
    updateAnimal,
    updateNoValidation,
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
    const [warningProps, setWarningProps] = useState(DefaultWarning)
    const [loading, setLoading] = useState(false)
    const [externalAnimal, setExternalAnimal] = useState(false)

    const onNoValidation: SubmitHandler<AnimalSave> = (data: AnimalSave) => {
        const entry: AnimalSave = {
            ...data,
            sex: 'M',
            animalType: 'REPRODUCTION_ANIMAL',
        }
        setLoading(true)
        addNoValidation(entry)
            .then(() => {
                setAdded(true)
                setError(undefined)
            })
            .catch((err: APIError) => setError(err))
            .finally(() => {
                setWarningProps(DefaultWarning)
                setLoading(false)
            })
    }

    const onReplace: SubmitHandler<AnimalSave> = (data: AnimalSave) => {
        const entry: AnimalSave = {
            ...data,
            sex: 'M',
            animalType: 'REPRODUCTION_ANIMAL',
        }
        setLoading(true)
        replaceAnimal(entry)
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
                setWarningProps({
                    openYesNo: true,
                    title: err.title,
                    content: err.message,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: handleSubmit(onNoValidation)
                })
            })
            .finally(() => setLoading(false))
    }

    const onUpdateNoValidation: SubmitHandler<AnimalSave> = (data: AnimalSave) => {
        const entry: AnimalSave = {
            ...data,
            sex: 'M',
            animalType: 'REPRODUCTION_ANIMAL',
        }
        setLoading(true)
        updateNoValidation(entry)
            .then(() => {
                setAdded(true)
                setError(undefined)
                setWarningProps(DefaultWarning)
                reset()
            })
            .catch((err: APIError) => setError(err))
            .finally(() => setLoading(false))
    }

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
                setWarningProps(DefaultWarning)
                reset()
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: err.title,
                    content: err.message,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: handleSubmit(onUpdateNoValidation)
                })
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
                setWarningProps(DefaultWarning)
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }
                const warnProps: YesNoDialogProps = {
                    openYesNo: true,
                    title: err.title,
                    content: err.message,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: undefined
                }
                if (err.kind == "IgnoreWarning") {
                    setWarningProps({ ...warnProps, onYes: handleSubmit(onReplace) })
                    return
                }
                setWarningProps({ ...warnProps, onYes: handleSubmit(onNoValidation) })
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
                content={error?.message}
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

    const [motherId, setMotherId] = useState<string>()

    if (formType === 'cattleAnimal') {
        return <>
            <FormSearchBox
                label="*Mãe"
                searchOptions={searchAllMothers}
                onChange={(id) => setMotherId(id)}
                formProps={{
                    control,
                    name: 'motherId',
                    rules: { required: REQUIRED_FIELD_MSG }
                }}
            />
            <FormSearchBox
                label="*Animal"
                searchOptions={() => {
                    if (!motherId) return Promise.reject()
                    return searchMaleChildren(motherId)
                }}
                onChange={(id) => {
                    if (!id) return
                    findById(id)
                        .then((response: Animal) => {
                            setValue('fatherId', response.fatherId)
                            setValue('birthDate', response.birthDate)
                            setValue('weaningDate', response.weaningDate)
                            setValue('weightBirth', response.weightBirth)
                            setValue('observation', response.observation)
                        })
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
            formProps={{ control, name: 'fatherId' }}
            searchOptions={searchBulls}
        />
        <FormSearchBox
            label="Mãe"
            onChange={(id) => setMotherId(id)}
            formProps={{ control, name: 'motherId' }}
            searchOptions={searchAllMothers}
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
