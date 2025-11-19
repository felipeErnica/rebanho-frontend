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
import { useCallback, useState } from "react"
import { APIError } from "@/util/ApiRequest"

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

    const { control, handleSubmit, reset, setFocus } = useForm<InseminationEntrySave>({
        defaultValues: { bullId, inseminationDate }
    })

    const onClose = useCallback(() => {
        reset()
        closeAddInsemination(added)
    }, [added, closeAddInsemination, reset])

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
                    searchOptions={searchInseminationBulls}
                    formProps={{
                        control,
                        name: 'bullId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="*Vaca"
                    className="w-[400]"
                    searchOptions={searchOwnedMothers}
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
                    maxRows={8}
                    formProps={{
                        control,
                        name: 'observation'
                    }}
                />
            </DialogContainer>
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
