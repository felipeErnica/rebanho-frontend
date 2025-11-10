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
import { DialogActionButtons, DialogContainer, YesNoDialog, YesNoDialogProps } from "@/ui/shared/dialog/DialogComponents"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { CONFLICT_WARNING, REQUIRED_FIELD_MSG, ERROR_TYPE } from "@/ui/shared/Globals"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchDairyAnimal, searchPastures } from "@/shared/GlobalApiCalls"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AddMilkEntryType } from "./Entities"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { APIError } from "@/util/ApiRequest"
import { addMilkAndTransferPasture, addMilkEntry, addMilkNoTransfer, replaceMilkEntry } from "./Controller"

type AddTestDialogProps = {
    addMilkEntryOpen: boolean
    onClose: (added: boolean) => void
    entryDate?: Date
}

export const AddMilkEntryDialog = ({ addMilkEntryOpen, onClose, entryDate }: AddTestDialogProps) => {

    const defaultWarning: YesNoDialogProps = useMemo(() => ({
        openYesNo: false,
        title: undefined,
        content: undefined,
        onYes: () => { },
        onClose: () => { }
    }), [])

    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState<YesNoDialogProps>(defaultWarning)
    const [loading, setLoading] = useState(false)
    const [resetFlag, setResetFlag] = useState(0)
    const [added, setAdded] = useState(false)
    const [noPasture, setNoPasture] = useState(false)

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
        setFocus
    } = useForm<AddMilkEntryType>({ defaultValues: { entryDate } })

    useEffect(() => setValue('entryDate', entryDate), [setValue, entryDate])

    useEffect(() => {
        reset({ entryDate: getValues('entryDate'), pastureId: getValues('pastureId') })
        setFocus('animalId')
    }, [getValues, reset, resetFlag, setFocus])

    const onReplace: SubmitHandler<AddMilkEntryType> = useCallback((data: AddMilkEntryType) => {
        data.quantity = Number(data.quantity)
        replaceMilkEntry(data)
            .then(() => {
                setAdded(true)
                setError(undefined)
            })
            .catch(error => setError(error))
            .finally(() => {
                setResetFlag(prev => prev + 1)
                setWarningProps(defaultWarning)
            })
    }, [defaultWarning])

    const onTransfer: SubmitHandler<AddMilkEntryType> = useCallback((data: AddMilkEntryType) => {
        data.quantity = Number(data.quantity)
        addMilkAndTransferPasture(data)
            .then(() => {
                setAdded(true)
                setError(undefined)
                setWarningProps(defaultWarning)
                setResetFlag(prev => prev + 1)
            })
            .catch(error => {
                if (error.errType == ERROR_TYPE) {
                    setError(error)
                    setWarningProps(defaultWarning)
                    setResetFlag(prev => prev + 1)
                    return
                }
                setWarningProps({
                    title: error.title,
                    content: error.message,
                    openYesNo: true,
                    onYes: handleSubmit(onReplace),
                    onClose: () => {
                        setWarningProps(defaultWarning)
                        setResetFlag(prev => prev + 1)
                    }
                })
            })
    }, [defaultWarning, handleSubmit, onReplace])

    const onSubmitNoTransfer: SubmitHandler<AddMilkEntryType> = useCallback((data: AddMilkEntryType) => {
        data.quantity = Number(data.quantity)
        addMilkNoTransfer(data)
            .then(() => {
                setAdded(true)
                setError(undefined)
                setWarningProps(defaultWarning)
                setResetFlag(prev => prev + 1)
            })
            .catch(error => {
                if (error.errType == ERROR_TYPE) {
                    setError(error)
                    setWarningProps(defaultWarning)
                    setResetFlag(prev => prev + 1)
                    return
                }
                setWarningProps({
                    title: error.title,
                    content: error.message,
                    openYesNo: true,
                    onYes: handleSubmit(onReplace),
                    onClose: () => {
                        setWarningProps(defaultWarning)
                        setResetFlag(prev => prev + 1)
                    }
                })
            })
    }, [defaultWarning, handleSubmit, onReplace])

    const errHandling = useCallback((err: APIError) => {
        if (err.errType == ERROR_TYPE) {
            setError(err)
            return
        }
        if (err.kind === CONFLICT_WARNING) {
            setWarningProps({
                title: err.title,
                content: err.message,
                openYesNo: true,
                onYes: handleSubmit(onReplace),
                onClose: () => {
                    setWarningProps(defaultWarning)
                    setResetFlag(prev => prev + 1)
                }
            })
            return
        }
        setWarningProps({
            title: err.title,
            content: err.message,
            openYesNo: true,
            onYes: handleSubmit(onTransfer),
            onClose: handleSubmit(onSubmitNoTransfer)
        })
    }, [defaultWarning, handleSubmit, onReplace, onSubmitNoTransfer, onTransfer])


    const onSubmit: SubmitHandler<AddMilkEntryType> = (data: AddMilkEntryType) => {
        data.quantity = Number(data.quantity)
        setLoading(true)
        addMilkEntry(data)
            .then(() => {
                setAdded(true)
                setError(undefined)
                reset({ entryDate: data.entryDate, pastureId: data.pastureId })
                setFocus('animalId')
            })
            .catch(err => errHandling(err))
            .finally(() => setLoading(false))
    }

    const handleClose = () => {
        setWarningProps(defaultWarning)
        setError(undefined)
        reset()
        onClose(added)
    }

    const alertOnClose = () => {
        setError(undefined)
    }

    return <Dialog
        open={addMilkEntryOpen}
        onClose={handleClose}
    >
        <DialogTitle>Adicionar Marcação de Leite</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={alertOnClose}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    label="Data de Marcação"
                    className="w-[200]"
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
                        className="w-[400]"
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
                        className="w-[100]"
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
