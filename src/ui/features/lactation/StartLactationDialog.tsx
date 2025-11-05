import { DialogActionButtons, DialogContainer } from "@/ui/shared/dialog/DialogComponents"
import {
    Alert,
    AlertTitle,
    Chip,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItem,
    Typography
} from "@mui/material"
import { useCallback, useState } from "react"
import { addLactation, searchDryAnimals } from "./Controller"
import { useForm } from "react-hook-form"
import { AddLactationStruct } from "./Entities"
import { FormMultipleSearchBox, SearchBoxItem } from "@/ui/shared/form-controls/FormSearchBox"
import { APIError } from "@/util/ApiRequest"
import { ConnectionError } from "@/ui/shared/Globals"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"

type StartLacDialogProps = {
    openStartLac: boolean
    closeStartLac: () => void
}

type StartLacDialogForm = {
    animalId: string[]
    startDate: Date
}

export const StartLacDialog = ({ openStartLac, closeStartLac }: StartLacDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [lacs, setLacs] = useState<SearchBoxItem[]>([])
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, setValue, reset } = useForm<StartLacDialogForm>()

    const onSubmit = useCallback((data: StartLacDialogForm) => {
        setLoading(true)
        const addLacList: AddLactationStruct[] = data.animalId.map(item => ({
            animalId: item,
            startDate: data.startDate
        }))

        addLactation(addLacList)
            .then(response => {
                if (response.status != 200) {
                    setError(response.json)
                    return
                }
                reset()
                closeStartLac()
            })
            .catch(() => setError(ConnectionError))
            .finally(() => setLoading(false))
    }, [closeStartLac, reset])

    const onSave = handleSubmit(onSubmit)

    const handleDelete = useCallback((deleted: SearchBoxItem) => {
        const newLacs = lacs.filter(item => item.id !== deleted.id)
        setLacs(newLacs)
        setValue('animalId', newLacs.map(item => item.id))
    }, [lacs, setValue])

    return <Dialog open={openStartLac}>
        <DialogTitle>Iniciar Lactações</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error">
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer className="flex flex-col overflow-hidden">
                <FormDatePicker
                    className="w-[200]"
                    label="Data de Início"
                    formProps={{ control, name: 'startDate' }}
                />
                <FormMultipleSearchBox
                    formProps={{ control, name: 'animalId' }}
                    label="Selecionar Vacas"
                    searchOptions={searchDryAnimals}
                    onChange={(items) => setLacs(items)}
                    noRenderValue
                />
                <div>
                    <Typography>Vacas Selecionadas:</Typography>
                    <div className="max-h-[250] flex flex-col gap-2 overflow-auto">
                        {lacs.map(lac => (
                            <ListItem>
                                <Chip label={lac.label} onDelete={() => handleDelete(lac)} />
                            </ListItem>
                        ))}
                    </div>
                </div>
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Enviar"
                onSave={onSave}
                onClose={closeStartLac}
            />
        </DialogActions>
    </Dialog>

}
