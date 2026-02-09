import { Alert, AlertTitle, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { Control, SubmitHandler, useForm, UseFormGetValues, UseFormSetValue } from "react-hook-form"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { FormRadioGroup } from "@shared/form-controls/FormRadioGroup"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { RadioComponent } from "@shared/common/RadioComponent"
import { addTest } from "./Service"
import { APIError } from "@utils/ApiRequest"
import { TestSave } from "./Entities"
import { searchMothers } from "../animals/Service"
import { Animal, getAnimalLabel } from "@features/animals/Entities"

type AddTestDialogProps = {
    addTestOpen: boolean
    closeAddTest: (added?: boolean) => void
    testDate?: Date
}

export const AddTestDialog = ({ addTestOpen, closeAddTest, testDate }: AddTestDialogProps) => {

    const { handleSubmit, control, reset, setValue, getValues } = useForm<TestSave>({
        defaultValues: { testDate }
    })

    const [disableForecast, setDisableForecast] = useState(true)
    const [forecastType, setForecastType] = useState<'days' | 'date'>('days')
    const [mothers, setMothers] = useState<Animal[]>([])
    const [loadingControls, setLoadingControls] = useState(false)

    const [added, setAdded] = useState(false)
    const [warning, setWarning] = useState<APIError>()
    const [error, setError] = useState<APIError>()
    const [loading, setLoading] = useState(false)

    useEffect(() => testDate && setValue('testDate', testDate), [setValue, testDate])
    useEffect(() => {
        setLoadingControls(true)
        searchMothers()
            .then(response => setMothers(response))
            .catch(() => setMothers([]))
            .finally(() => setLoadingControls(false))
    }, [])

    const onSubmit: SubmitHandler<TestSave> = (data: TestSave) => {
        setLoading(true)
        addTest(data)
            .then(() => {
                reset({
                    testDate: data.testDate,
                    pregnancyStatus: data.pregnancyStatus
                })
                setAdded(true)
                setError(undefined)
                setWarning(undefined)
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

    const onClose = () => {
        reset()
        setError(undefined)
        setWarning(undefined)
        closeAddTest(added)
    }

    return <Dialog
        open={addTestOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Toque</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    label="Data de Exame"
                    className="w-45"
                    disableFuture
                    formProps={{
                        control,
                        name: 'testDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Vaca"
                    className="w-100"
                    loading={loadingControls}
                    options={mothers.map(item => ({
                        id: item.id,
                        label: getAnimalLabel(item)
                    }))}
                    formProps={{
                        control,
                        rules: { required: REQUIRED_FIELD_MSG },
                        name: 'animalId'
                    }}
                />
                <FormRadioGroup
                    label="Prenhez"
                    row
                    controls={[
                        { label: "Confirmada", value: "SUCCESS" },
                        { label: "Vazia", value: "FAILED" },
                    ]}
                    onChange={(value) => setDisableForecast(value === "FAILED")}
                    formProps={{
                        control,
                        rules: { required: REQUIRED_FIELD_MSG },
                        name: 'pregnancyStatus'
                    }}
                />
                <div className="flex flex-col gap-2">
                    <RadioComponent
                        value={forecastType}
                        disabled={disableForecast}
                        label="Previsão de Parto"
                        onChange={(_, value) => setForecastType(value as 'days' | 'date')}
                        row
                        controls={[
                            { value: 'days', label: 'Por Dia' },
                            { value: 'date', label: 'Por Data' }
                        ]}
                    />
                    <ForecastControl
                        disableForecast={disableForecast}
                        control={control}
                        forecastType={forecastType}
                        getValue={getValues}
                        setValue={setValue}
                    />
                </div>
                <FormTextField
                    label="Observações"
                    variant="outlined"
                    multiline
                    rows={5}
                    formProps={{
                        control,
                        name: 'observation'
                    }}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                onClose={onClose}
                onSave={handleSubmit(onSubmit)}
                loading={loading}
                saveText="Adicionar"
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

type ForecastControlProps = {
    setValue: UseFormSetValue<TestSave>
    getValue: UseFormGetValues<TestSave>
    forecastType: "date" | "days" | undefined
    control: Control<TestSave, any, TestSave>
    disableForecast: boolean
}

function ForecastControl({ control, setValue, getValue, forecastType, disableForecast }: ForecastControlProps) {

    const PREGNANCY_DURATION_EST = 310

    if (!forecastType) return

    if (forecastType == 'date') {
        return <FormDatePicker
            label="Data Prevista"
            className="w-50"
            minDate={dayjs(getValue('testDate')).add(1, 'day')}
            formProps={{
                control,
                name: 'birthForecast',
                disabled: disableForecast,
                rules: { required: REQUIRED_FIELD_MSG }
            }}
            onChange={(value) => {

                if (!value) {
                    setValue('pregnancyTime', undefined)
                    return
                }

                const testDate = dayjs(getValue('testDate'))
                const dateDiff = value.diff(testDate, 'days')
                const daysTobirth = PREGNANCY_DURATION_EST - dateDiff
                setValue('pregnancyTime', daysTobirth)
            }}
        />
    }

    return <FormTextField
        label="Tempo de Prenhez"
        className="w-50"
        type="number"
        formProps={{
            control,
            name: 'pregnancyTime',
            disabled: disableForecast,
            rules: {
                required: REQUIRED_FIELD_MSG,
                max: { value: PREGNANCY_DURATION_EST, message: `O número de dias não pode ser maior que ${PREGNANCY_DURATION_EST}.` },
                min: { value: 1, message: "Insira um número maior que 0." }
            }
        }}
        onChange={(value: number) => {

            if (!value) {
                setValue('birthForecast', undefined)
                return
            }

            const testDate = dayjs(getValue('testDate'))
            const daysTobirth = PREGNANCY_DURATION_EST - value
            const birthForecast = testDate.add(daysTobirth, 'days')
            setValue('birthForecast', birthForecast.toDate())
        }}
    />
}
