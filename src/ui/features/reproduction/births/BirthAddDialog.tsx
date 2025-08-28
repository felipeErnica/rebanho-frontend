import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { BirthEntry } from "./Entities"
import { searchFather, searchMother } from "@/shared/GlobalApiCalls"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { FormRadioGroup } from "@/ui/shared/form-controls/FormRadioGroup"

type AddBirthDialogProps = {
    isAddBirthOpen: boolean
    setAddBirthOpen: (isAddBirthOpen: boolean) => void
}

export const AddBirthDialog = ({ isAddBirthOpen, setAddBirthOpen }: AddBirthDialogProps) => {

    const { handleSubmit, control } = useForm<BirthEntry>()

    const onClose = () => setAddBirthOpen(false)
    const onSave: SubmitHandler<BirthEntry> = (data: BirthEntry) => {
        console.log(data)
        setAddBirthOpen(false)
    }

    return <Dialog
        open={isAddBirthOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Parição</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
            <FormSearchBox
                label="Mãe"
                searchOptions={searchMother}
                formProps={{
                    control,
                    name: 'motherId'
                }}
            />
            <FormDatePicker
                label="Data de Nascimento"
                formProps={{
                    control,
                    name: 'calfBirthDate'
                }}
            />
            <FormRadioGroup
                label="Sexo"
                row
                controls={[{ label: 'Macho', value: 'M' }, { label: 'Fêmea', value: 'F' }]}
                formProps={{
                    control,
                    name: 'calfSex'
                }}
            />
            <FormSearchBox
                label="Pai"
                searchOptions={searchFather}
                formProps={{
                    control,
                    name: 'calfFatherId'
                }}
            />
            <FormTextField
                label="Observações da Parição"
                variant="outlined"
                multiline
                rows={5}
                formProps={{
                    control,
                    name: 'observation'
                }}
            />
        </DialogContent>
        <DialogActions>
            <div className="flex flex-row-reverse">
                <Button onClick={handleSubmit(onSave)}>Adicionar</Button>
                <Button onClick={onClose}>Cancelar</Button>
            </div>
        </DialogActions>
    </Dialog>
}
