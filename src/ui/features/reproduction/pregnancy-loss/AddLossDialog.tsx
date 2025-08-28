import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { Loss } from "./Entities"
import { DialogActionButtons, DialogContainer } from "@/ui/shared/form-controls/DialogComponents"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchMother } from "@/shared/GlobalApiCalls"
import { REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"

interface AddLossDialogProps {
    addLossOpen: boolean
    setAddLossOpen: (addLossOpen: boolean) => void
}

export const AddLossDialog = ({ addLossOpen, setAddLossOpen }: AddLossDialogProps) => {

    const { handleSubmit, control, reset } = useForm<Loss>()

    const onClose = () => {
        reset()
        setAddLossOpen(false)
    }

    const onSubmit: SubmitHandler<Loss> = (data: Loss) => {
        console.log(data)
        reset()
    }

    return <Dialog open={addLossOpen} onClose={onClose}>
        <DialogTitle>Adicionar Registro de Interrupção</DialogTitle>
        <DialogContent>
            <DialogContainer className="flex flex-col gap-4">
                <FormSearchBox
                    label="Vaca"
                    searchOptions={searchMother}
                    formProps={{
                        control,
                        name: 'animalId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormDatePicker 
                    className="w-[250]"
                    label="Data de Registro"
                    formProps={{
                        control,
                        name: 'lossDate'
                    }}
                />
                <FormTextField 
                    label="Observações"
                    multiline
                    rows={5}
                    formProps={{
                        control,
                        name: 'observation'
                    }}
                />
            </DialogContainer>
            <DialogActions>
                <DialogActionButtons 
                    onClose={onClose}
                    onSave={handleSubmit(onSubmit)}
                    saveText="Adicionar Registro"
                />
            </DialogActions>
        </DialogContent>
    </Dialog>

}
