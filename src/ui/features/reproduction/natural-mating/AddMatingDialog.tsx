import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { MatingEntry } from "./Entities"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { searchAllMothers } from "@/shared/GlobalApiCalls"
import { REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"

type AddMatingDialogProps = {
    addMatingOpen: boolean
    setAddMatingOpen: (addMatingOpen: boolean) => void
    bullId?: string
    matingDate?: Date
}

export const AddMatingDialog = ({
    addMatingOpen,
    setAddMatingOpen,
    bullId,
    matingDate
}: AddMatingDialogProps) => {

    const { control, handleSubmit, reset, setFocus } = useForm<MatingEntry>({
        defaultValues: { bullId, matingDate }
    })

    const onClose = () => {
        reset()
        setAddMatingOpen(false)
    }

    const onSubmit: SubmitHandler<MatingEntry> = (data: MatingEntry) => {
        reset({
            matingDate: data.matingDate,
            bullId: data.bullId
        })
        setFocus('animalId')
    }

    return <Dialog
        open={addMatingOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Monta</DialogTitle>
        <DialogContent>
            <div className="w-[500] flex flex-col gap-8 p-4">
                <FormDatePicker
                    className="w-[250]"
                    label="*Data de Monta"
                    formProps={{
                        control,
                        name: 'matingDate',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Vaca"
                    searchOptions={searchAllMothers}
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
                    formProps={{ control, name: 'observation' }}
                />
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleSubmit(onSubmit)}>
                Adicionar
            </Button>
            <Button onClick={onClose}>
                Cancelar
            </Button>
        </DialogActions>
    </Dialog>
}
