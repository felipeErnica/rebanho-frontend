import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { DialogActionButtons, DialogContainer } from "@/ui/shared/form-controls/DialogComponents"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchDairyAnimal } from "@/shared/GlobalApiCalls"
import { useEffect } from "react"
import { MilkEntry } from "./Entities"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"

type AddTestDialogProps = {
    addMilkEntryOpen: boolean
    setAddMilkEntryOpen: (addMilkEntryOpen: boolean) => void
    entryDate?: Date
}

export const AddMilkEntryDialog = ({ addMilkEntryOpen, setAddMilkEntryOpen, entryDate }: AddTestDialogProps) => {

    const { handleSubmit, control, reset, setValue } = useForm<MilkEntry>({
        defaultValues: { entryDate }
    })

    useEffect(() => setValue('entryDate', entryDate), [setValue, entryDate])

    const onSubmit: SubmitHandler<MilkEntry> = (data: MilkEntry) => {
        console.log(data)
        reset({ entryDate: data.entryDate })
    }

    const onClose = () => {
        reset()
        setAddMilkEntryOpen(false)
    }

    return <Dialog
        open={addMilkEntryOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Marcação de Leite</DialogTitle>
        <DialogContent>
            <DialogContainer className="grid grid-flow-row gap-x-4 gap-y-8">
                <FormDatePicker
                    className="col-span-3"
                    label="Data de Marcação"
                    formProps={{
                        control,
                        name: 'entryDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Vaca"
                    className="col-span-2"
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
                    formProps={{
                        control,
                        name: 'quantity',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                onClose={onClose}
                onSave={handleSubmit(onSubmit)}
                saveText="Marcar Leite"
            />
        </DialogActions>
    </Dialog>
}
