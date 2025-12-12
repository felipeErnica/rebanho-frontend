import { Dialog, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { AnimalSave } from "../Entities"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { REQUIRED_FIELD_MSG } from "@shared/Globals"
import { searchAllMothers } from "@utils/GlobalApiCalls"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"

export type DialogProps = {
    isDialogOpen: boolean
    setDialogOpen: (isDialogOpen: boolean) => void
}

export const AddBirthDialog = ({ isDialogOpen, setDialogOpen }: DialogProps) => {

    const { handleSubmit, control } = useForm<AnimalSave>()

    const onSubmit: SubmitHandler<AnimalSave> = (data) => console.log(data)

    return <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
    >
        <DialogTitle>Adicionar Parição</DialogTitle>
        <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormSearchBox 
                    label="Mãe*"
                    formProps={{
                        control,
                        name: 'motherId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                    searchOptions={searchAllMothers}
                />
                <FormDatePicker
                    label="Data de Nascimento*"
                    formProps={{
                        control,
                        name: 'birthDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
            </form>
        </DialogContent>
    </Dialog>

}
