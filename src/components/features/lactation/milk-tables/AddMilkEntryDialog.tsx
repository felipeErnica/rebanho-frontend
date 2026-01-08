import {
    Alert,
    AlertTitle,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
} from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { DialogActionButtons, DialogContainer, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { CONFLICT_WARNING, REQUIRED_FIELD_MSG, ERROR_TYPE, DefaultWarning } from "@shared/Globals"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import {  searchPastures } from "@utils/GlobalApiCalls"
import { useCallback, useEffect,  useState } from "react"
import { MilkEntrySave } from "./Entities"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { APIError } from "@utils/ApiRequest"
import { addMilkEntry, replaceMilkEntry } from "./Controller"
import { transferPastureEntry } from "@features/farm-area/Controller"
import { PastureEntrySave } from "@features/farm-area/Entities"

type AddTestDialogProps = {
    addMilkEntryOpen: boolean
    onClose: (added: boolean) => void
    entryDate?: Date
}

export const AddMilkEntryDialog = ({ addMilkEntryOpen, onClose, entryDate }: AddTestDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState<YesNoDialogProps>(DefaultWarning)
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const [noPasture, setNoPasture] = useState(false)

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
        setFocus
    } = useForm<MilkEntrySave>({ defaultValues: { entryDate } })

    useEffect(() => setValue('entryDate', entryDate), [setValue, entryDate])

    const resetForm = useCallback(() => {
        reset({ entryDate: getValues('entryDate'), pastureId: getValues('pastureId') })
        setFocus('animalId')
    }, [getValues, reset, setFocus])

    const onTransfer = useCallback((data: MilkEntrySave) => {

        const pastureEntry: PastureEntrySave = {
            entryDate: data.entryDate,
            animalId: data.animalId,
            pastureId: data.pastureId
        }

        transferPastureEntry(pastureEntry)
            .then(() => {
                setAdded(true)
                setError(undefined)
                setWarningProps(DefaultWarning)
                resetForm()
            })
            .catch(error => setError(error))
    }, [resetForm])

    const onReplace = useCallback((data: MilkEntrySave) => {
        replaceMilkEntry(data)
            .then(() => {
                setAdded(true)
                setError(undefined)
                resetForm()
            })
            .catch((error: APIError) => {

                if (error.errType == ERROR_TYPE) {
                    setError(error)
                    return
                }

                setWarningProps({
                    title: error.title,
                    content: error.message,
                    openYesNo: true,
                    onYes: () => onTransfer(data),
                    onClose: () => setWarningProps(DefaultWarning)
                })

            })
            .finally(() => setWarningProps(DefaultWarning))
    }, [onTransfer, resetForm])

    const onSubmit: SubmitHandler<MilkEntrySave> = (data: MilkEntrySave) => {
        setLoading(true)
        addMilkEntry(data)
            .then(() => {
                setAdded(true)
                setError(undefined)
                resetForm()
            })
            .catch((err: APIError) => {
                if (err.errType == ERROR_TYPE) {
                    setError(err)
                    return
                }

                const commonWarning: YesNoDialogProps = {
                    openYesNo: true,
                    title: err.title,
                    content: err.message,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: undefined,
                }

                if (err.kind == CONFLICT_WARNING) {
                    setWarningProps({
                        ...commonWarning,
                        onYes: () => onReplace(data)
                    })
                    return
                }

                setWarningProps({
                    ...commonWarning,
                    onYes: () => onTransfer(data)
                })

            })
            .finally(() => setLoading(false))
    }

    const handleClose = () => {
        setWarningProps(DefaultWarning)
        setError(undefined)
        reset()
        onClose(added)
    }

    return <Dialog
        open={addMilkEntryOpen}
        onClose={handleClose}
    >
        <DialogTitle>Adicionar Marcação de Leite</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    label="Data de Marcação"
                    className="w-[200px]"
                    disableFuture
                    formProps={{
                        control,
                        name: 'entryDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <div className="flex flex-col">
                    <FormSearchBox
                        label="Lote"
                        searchOptions={searchPastures}
                        formProps={{
                            control,
                            name: 'pastureId',
                            rules: { required: REQUIRED_FIELD_MSG },
                            disabled: noPasture
                        }}
                    />
                    <FormControlLabel
                        label="Não informar Lote"
                        control={(
                            <Checkbox
                                checked={noPasture}
                                onChange={() => setNoPasture(prev => !prev)}
                            />
                        )}
                    />
                </div>
                <div className="flex flex-row gap-4">
                    <FormSearchBox
                        label="Vaca"
                        className="w-[400px]"
                        searchOptions={searchDairyAnimal}
                        formProps={{
                            control,
                            rules: { required: REQUIRED_FIELD_MSG },
                            name: 'animalId'
                        }}
                    />
                    <FormTextField
                        label="Quantidade"
                        type="number"
                        className="w-[100px]"
                        formProps={{
                            control,
                            name: 'quantity',
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}
                    />
                </div>
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                onClose={handleClose}
                onSave={handleSubmit(onSubmit)}
                saveText="Marcar Leite"
            />
        </DialogActions>
        <YesNoDialog {...warningProps} />
    </Dialog>
}
