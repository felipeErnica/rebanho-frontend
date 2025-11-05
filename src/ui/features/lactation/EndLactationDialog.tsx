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
import { searchLactating, updateEndDate } from "./Controller"
import { useForm } from "react-hook-form"
import { LactationEndDate } from "./Entities"
import { FormMultipleSearchBox, SearchBoxItem } from "@/ui/shared/form-controls/FormSearchBox"
import { APIError } from "@/util/ApiRequest"
import { ConnectionError } from "@/ui/shared/Globals"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"

type EndLactationDialogProps = {
    openEndLactation: boolean
    closeEndLactation: () => void
}

type EndLactationForm = {
    lacId: string[]
    endDate: Date
}

export const EndLactationDialog = ({ openEndLactation, closeEndLactation }: EndLactationDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [lacs, setLacs] = useState<SearchBoxItem[]>([])
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, setValue, reset } = useForm<EndLactationForm>()

    const onSubmit = useCallback((data: EndLactationForm) => {
        setLoading(true)
        const updateLacList: LactationEndDate[] = data.lacId.map(item => ({
            id: item,
            endDate: data.endDate
        }))
        updateEndDate(updateLacList)
            .then(response => {
                if (response.status != 200) {
                    setError(response.json)
                    return
                }
                reset()
                closeEndLactation()
            })
            .catch(() => setError(ConnectionError))
            .finally(() => setLoading(false))
    }, [closeEndLactation, reset])

    const onSave = handleSubmit(onSubmit)

    const handleDelete = useCallback((deleted: SearchBoxItem) => {
        const newLacs = lacs.filter(item => item.id !== deleted.id)
        setLacs(newLacs)
        setValue('lacId', newLacs.map(item => item.id))
    }, [lacs, setValue])

    return <Dialog open={openEndLactation}>
        <DialogTitle>Secar Vacas</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error">
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer className="flex flex-col overflow-hidden">
                <FormDatePicker
                    className="w-[250]"
                    label="Data do Fim da Lactação"
                    formProps={{ control, name: 'endDate' }}
                />
                <FormMultipleSearchBox
                    formProps={{ control, name: 'lacId' }}
                    limitTags={1}
                    label="Selecionar Vacas"
                    searchOptions={searchLactating}
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
                saveText="Secar Vacas"
                onSave={onSave}
                onClose={closeEndLactation}
            />
        </DialogActions>
    </Dialog>

}
