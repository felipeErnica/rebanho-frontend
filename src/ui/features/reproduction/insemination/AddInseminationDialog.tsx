import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { InseminationEntrySave } from "./Entities"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { searchOwnedMothers } from "@/shared/GlobalApiCalls"
import { REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { addInsemiantion, replaceInsemination, searchInseminationBulls } from "./Controller"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@/ui/shared/dialog/DialogComponents"
import { useCallback, useEffect, useState } from "react"
import { APIError } from "@/util/ApiRequest"
import { AddBullDialog } from "@features/animals/AddBullDialog"
import { AddCowDialog } from "@features/animals/AddCowDialog"
import { AddInseminationBullDialog } from "./AddInseminationBull"

type AddInseminationDialogProps = {
    addInseminationOpen: boolean
    closeAddInsemination: (added?: boolean) => void
    bullId?: string
    inseminationDate?: Date
}

export const AddInseminationDialog = ({
    addInseminationOpen,
    closeAddInsemination,
    bullId,
    inseminationDate
}: AddInseminationDialogProps) => {

    const [loading, setLoading] = useState(false)
    const [warning, setWarning] = useState<APIError>()
    const [added, setAdded] = useState(false)
    const [reload, setReload] = useState(0)

    const [addInseminationBull, setAddInseminationBull] = useState(false)
    const [addBullOpen, setAddBullOpen] = useState(false)
    const [addCowOpen, setAddCowOpen] = useState(false)

    const { control, handleSubmit, reset, setFocus, setValue } = useForm<InseminationEntrySave>({
        defaultValues: { bullId, inseminationDate }
    })

    useEffect(() => {
        if (!inseminationDate) return
        setValue('inseminationDate', inseminationDate)
    }, [inseminationDate, setValue])

    const onClose = useCallback(() => {
        reset()
        closeAddInsemination(added)
    }, [added, closeAddInsemination, reset])

    const closeAddInseminationBull = (added?: boolean) => {
        if (added) setReload(prev => prev + 1)
        setAddInseminationBull(false)
    }

    const closeAddBull = (added?: boolean) => {
        if (added) setReload(prev => prev + 1)
        setAddBullOpen(false)
    }

    const closeAddCow = (added?: boolean) => {
        if (added) setReload(prev => prev + 1)
        setAddCowOpen(false)
    }

    const onSubmit: SubmitHandler<InseminationEntrySave> = (data: InseminationEntrySave) => {
        setLoading(true)
        addInsemiantion(data)
            .then(() => {
                reset({
                    inseminationDate: data.inseminationDate,
                    bullId: data.bullId
                })
                setFocus('animalId')
                setWarning(undefined)
                setAdded(true)
            })
            .catch(err => setWarning(err))
            .finally(() => setLoading(false))
    }

    const onReplace: SubmitHandler<InseminationEntrySave> = (data: InseminationEntrySave) => {
        setLoading(true)
        replaceInsemination(data)
            .then(() => {
                reset({
                    inseminationDate: data.inseminationDate,
                    bullId: data.bullId
                })
                setFocus('animalId')
                setWarning(undefined)
                setAdded(true)
            })
            .finally(() => setLoading(false))
    }

    return <Dialog
        open={addInseminationOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Inseminação</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <FormDatePicker
                    className="w-[250]"
                    label="*Data de Inseminação"
                    formProps={{
                        control,
                        name: 'inseminationDate',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Touro"
                    reload={reload}
                    searchOptions={searchInseminationBulls}
                    emptyProps={[
                        {
                            id: 'addExistingBull',
                            title: '+ Adicionar Touro como Touro de Cobertura',
                            onEmpty: () => setAddInseminationBull(true)
                        },
                        {
                            id: 'newBull',
                            title: '+ Adicionar Novo Touro',
                            onEmpty: () => setAddBullOpen(true)
                        }
                    ]}
                    formProps={{
                        control,
                        name: 'bullId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="*Vaca"
                    reload={reload}
                    className="w-[400]"
                    searchOptions={searchOwnedMothers}
                    emptyProps={[{
                        id: 'newCow',
                        title: '+ Adicionar Vaca',
                        onEmpty: () => setAddCowOpen(true)
                    }]}
                    formProps={{
                        control,
                        name: 'animalId',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormTextField
                    label="Observações"
                    multiline
                    rows={5}
                    maxRows={5}
                    formProps={{
                        control,
                        name: 'observation'
                    }}
                />
            </DialogContainer>
            <AddInseminationBullDialog {...{ addInseminationBull, closeAddInseminationBull }} />
            <AddBullDialog {...{ addBullOpen, closeAddBull }} />
            <AddCowDialog {...{ addCowOpen, closeAddCow }} />
        </DialogContent>
        <DialogActions>
            <DialogActionButtons 
                loading={loading}
                saveText="Adicionar"
                onSave={handleSubmit(onSubmit)}
                onClose={onClose}
            />
        </DialogActions>
        <YesNoDialog 
            openYesNo={!!warning}
            title={warning?.title}
            content={warning?.message}
            onYes={handleSubmit(onReplace)}
            onClose={() => setWarning(undefined)}
        />
    </Dialog>
}
