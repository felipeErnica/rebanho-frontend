import { Alert, AlertTitle, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { EmbryoTransferSave } from "./Entities"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { addTransfer, replace, searchEmbryoDonors, searchTransferBulls } from "./Controller"
import { AddTransferBull } from "./AddTransferBull"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { useEffect, useState } from "react"
import { AddBullDialog } from "@features/animals/AddBullDialog"
import { AddEmbryoDonorDialog } from "./AddEmbryoDonor"
import { AddCowDialog } from "@features/animals/AddCowDialog"
import { APIError } from "@utils/ApiRequest"

type AddTransferDialogProps = {
    addTransferOpen: boolean
    closeAddTransfer: (added?: boolean) => void
    bullId?: string
    transferDate?: Date
}

export const AddTransferDialog = ({
    addTransferOpen,
    closeAddTransfer,
    bullId,
    transferDate
}: AddTransferDialogProps) => {

    const [reloadDonorFlag, setReloadDonorFlag] = useState(0)
    const [reloadBullFlag, setReloadBullFlag] = useState(0)
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)

    const [addTransferBullOpen, setAddTransferBullOpen] = useState(false)
    const [addBullOpen, setAddBullOpen] = useState(false)
    const [addEmbryoDonorOpen, setAddEmbryoDonorOpen] = useState(false)
    const [addCowOpen, setAddCowOpen] = useState(false)

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()

    const { control, handleSubmit, reset, setFocus, setValue } = useForm<EmbryoTransferSave>({
        defaultValues: { bullId, transferDate }
    })

    useEffect(() => {
        if (transferDate) setValue('transferDate', transferDate)
        if (bullId) setValue('bullId', bullId)
    }, [bullId, setValue, transferDate])

    const onClose = () => {
        reset()
        closeAddTransfer(added)
    }

    const closeAddTransferBull = (added?: boolean) => {
        if (added) setReloadBullFlag(prev => prev + 1)
        setAddTransferBullOpen(false)
    }

    const closeAddBull = (added?: boolean) => {
        if (added) setReloadBullFlag(prev => prev + 1)
        setAddBullOpen(false)
    }

    const closeAddEmbryoDonor = (added?: boolean) => {
        if (added) setReloadDonorFlag(prev => prev + 1)
        setAddEmbryoDonorOpen(false)
    }

    const closeAddCow = (added?: boolean) => {
        if (added) setReloadDonorFlag(prev => prev + 1)
        setAddCowOpen(false)
    }

    const onSubmit: SubmitHandler<EmbryoTransferSave> = (data: EmbryoTransferSave) => {
        setLoading(true)
        addTransfer(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                setAdded(true)
                reset({
                    transferDate: data.transferDate,
                    donorId: data.donorId,
                    bullId: data.bullId,
                })
                setFocus('receiverId')
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

    const onReplace: SubmitHandler<EmbryoTransferSave> = (data: EmbryoTransferSave) => {
        setLoading(true)
        replace(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                setAdded(true)
                reset({
                    transferDate: data.transferDate,
                    donorId: data.donorId,
                    bullId: data.bullId,
                })
                setFocus('receiverId')
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

    return <Dialog
        open={addTransferOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Transferência</DialogTitle>
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
                    label="*Data de Transferência"
                    formProps={{
                        control,
                        name: 'transferDate',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Touro"
                    className="w-[400px]"
                    reload={reloadBullFlag}
                    searchOptions={searchTransferBulls}
                    emptyProps={[
                        {
                            id: 'updateBullAsTransfer',
                            title: '+ Adicionar Touro p/ Transferência',
                            onEmpty: () => setAddTransferBullOpen(true),
                        },
                        {
                            id: 'newBull',
                            title: '+ Adicionar Novo Touro',
                            onEmpty: () => setAddBullOpen(true),
                        }
                    ]}
                    formProps={{
                        control,
                        name: 'bullId',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Doadora"
                    reload={reloadDonorFlag}
                    searchOptions={searchEmbryoDonors}
                    emptyProps={[
                        {
                            id: 'addEmbryoDonor',
                            title: '+ Adicionar Doadora de Embrião',
                            onEmpty: () => setAddEmbryoDonorOpen(true),
                        },
                        {
                            id: 'addCow',
                            title: '+ Adicionar Nova Vaca',
                            onEmpty: () => setAddCowOpen(true),
                        },
                    ]}
                    formProps={{
                        control,
                        name: 'donorId',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Receptora"
                    searchOptions={searchOwnedMothers}
                    formProps={{
                        control,
                        name: 'receiverId',
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
                <YesNoDialog
                    openYesNo={!!warning}
                    title={warning?.title}
                    message={warning?.message}
                    onYes={handleSubmit(onReplace)}
                    onClose={() => setWarning(undefined)}
                />
            </DialogContainer>
            <AddTransferBull {...{ addTransferBullOpen, closeAddTransferBull }} />
            <AddBullDialog {...{ addBullOpen, closeAddBull, isTransferBull: true }} />
            <AddEmbryoDonorDialog {...{ addEmbryoDonorOpen, closeAddEmbryoDonor  }} />
            <AddCowDialog {...{ addCowOpen, closeAddCow, isEmbryoDonor: true }} />
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Adicionar"
                onSave={handleSubmit(onSubmit)}
                onClose={() => closeAddTransfer(added)}
            />
        </DialogActions>
    </Dialog>
}
