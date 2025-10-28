import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { EmbryoTransfer } from "./Entities"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { searchMother } from "@/shared/GlobalApiCalls"
import { REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"

type AddTransferDialogProps = {
    addTransferOpen: boolean
    setAddTransferOpen: (addTransferOpen: boolean) => void
    bullId?: string
    transferDate?: Date
}

export const AddTransferDialog = ({
    addTransferOpen,
    setAddTransferOpen,
    bullId,
    transferDate
}: AddTransferDialogProps) => {

    const { control, handleSubmit, reset, setFocus } = useForm<EmbryoTransfer>({
        defaultValues: { bullId, transferDate }
    })

    const onClose = () => {
        reset()
        setAddTransferOpen(false)
    }

    const onSubmit: SubmitHandler<EmbryoTransfer> = (data: EmbryoTransfer) => {
        reset({
            transferDate: data.transferDate,
            bullId: data.bullId,
            donorId: data.donorId
        })
        setFocus('receiverId')
    }

    return <Dialog
        open={addTransferOpen}
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
                        name: 'transferDate',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Doadora"
                    searchOptions={searchMother}
                    formProps={{
                        control,
                        name: 'donorId',
                        rules: { required: REQUIRED_FIELD_MSG },
                    }}
                />
                <FormSearchBox
                    label="*Receptora"
                    searchOptions={searchMother}
                    formProps={{
                        control,
                        name: 'receiverId',
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
