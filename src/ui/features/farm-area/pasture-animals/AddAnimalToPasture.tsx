import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormMultipleSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useForm } from "react-hook-form"
import { searchPastureAnimals } from "./Controller"

type AddAnimalsEntity = {
    animalsId: string[]
    entryDate: string
}

export type AddAnimalToPastureProps = {
    pastureId: string
    isAddAnimalOpen: boolean
    setAddAnimalOpen: (isAddAnimalOpen: boolean) => void
}

export const AddAnimalToPasture = ({ pastureId, isAddAnimalOpen, setAddAnimalOpen }: AddAnimalToPastureProps) => {

    const { handleSubmit, control } = useForm<AddAnimalsEntity>()
    const onClose = () => setAddAnimalOpen(false)
    const fetchAnimals = () => searchPastureAnimals(pastureId)

    const onSubmit = (data: AddAnimalsEntity) => console.log(data)

    return <Dialog
        open={isAddAnimalOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Animais</DialogTitle>
        <DialogContent>
            <div className="flex flex-col gap-4 p-4">
                <FormMultipleSearchBox
                    searchOptions={fetchAnimals}
                    label="Animais"
                    formProps={{
                        control,
                        name: 'animalsId'
                    }}
                />
                <FormDatePicker
                    label="Data de Entrada"
                    formProps={{
                        control,
                        name: 'entryDate'
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
