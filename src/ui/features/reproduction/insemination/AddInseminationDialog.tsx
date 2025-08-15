import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { InseminationEntry } from "./Entities"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { searchMother, searchMotherById } from "@/shared/GlobalApiCalls"
import { REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"

type AddInseminationDialogProps = {
    addInseminationOpen: boolean
    setAddInseminationOpen: (addInseminationOpen: boolean) => void
    bullId?: string
    inseminationDate?: Date
}

export const AddInseminationDialog = ({
    addInseminationOpen,
    setAddInseminationOpen,
    bullId,
    inseminationDate
}: AddInseminationDialogProps) => {

    const { control, handleSubmit, reset, setFocus } = useForm<InseminationEntry>({
        defaultValues: { bullId, inseminationDate }
    })

    const onClose = () => {
        reset()
        setAddInseminationOpen(false)
    }

    const onSubmit: SubmitHandler<InseminationEntry> = (data: InseminationEntry) => {
        console.log('AddInseminationDialog salvar: ', data)
        reset({
            inseminationDate: data.inseminationDate,
            bullId: data.bullId
        })
        setFocus('animalId')
    }

    return <Dialog
        open={addInseminationOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Inseminação</DialogTitle>
        <DialogContent>
            <div className="w-[500] flex flex-col gap-8 p-4">
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
                    label="*Vaca"
                    searchById={searchMotherById}
                    searchByInput={searchMother}
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
