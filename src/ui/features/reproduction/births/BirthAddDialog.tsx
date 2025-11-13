import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import {
    Alert,
    AlertTitle,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { BirthEntrySave } from "./Entities"
import { searchFather } from "@/shared/GlobalApiCalls"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { FormRadioGroup } from "@/ui/shared/form-controls/FormRadioGroup"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@/ui/shared/dialog/DialogComponents"
import { useState } from "react"
import { addBirth, replaceBirth, searchMother } from "./Controller"
import { APIError } from "@/util/ApiRequest"
import { CONFLICT_WARNING, REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"

type AddBirthDialogProps = {
    addBirthOpen: boolean
    setAddBirthOpen: (addBirthOpen: boolean) => void
}

export const AddBirthDialog = ({ addBirthOpen, setAddBirthOpen }: AddBirthDialogProps) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()

    const { handleSubmit, control, reset } = useForm<BirthEntrySave>()

    const onClose = () => {
        reset()
        setError(undefined)
        setWarning(undefined)
        setAddBirthOpen(false)
    }

    const onSave: SubmitHandler<BirthEntrySave> = (data: BirthEntrySave) => {
        setLoading(true)
        addBirth(data)
            .then(() => {
                reset()
                setError(undefined)
                setWarning(undefined)
            })
            .catch((err: APIError) => {
                if (err.kind == CONFLICT_WARNING) {
                    setWarning(err)
                    return
                }
                setError(err)
            })
            .finally(() => setLoading(false))
    }

    const onReplace: SubmitHandler<BirthEntrySave> = (data: BirthEntrySave) => {
        replaceBirth(data)
            .then(() => {
                reset()
                setError(undefined)
                setWarning(undefined)
            })
            .catch((err: APIError) => {
                setError(err)
                setWarning(undefined)
            })
    }

    return <Dialog
        open={addBirthOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Parição</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    label="Data de Nascimento"
                    className="w-[200]"
                    formProps={{
                        control,
                        name: 'birthDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Mãe"
                    className="w-[400]"
                    searchOptions={searchMother}
                    formProps={{
                        control,
                        name: 'motherId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormRadioGroup
                    label="Sexo"
                    row
                    controls={[{ label: 'Macho', value: 'M' }, { label: 'Fêmea', value: 'F' }]}
                    formProps={{
                        control,
                        name: 'sex',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Pai"
                    searchOptions={searchFather}
                    formProps={{
                        control,
                        name: 'fatherId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormTextField
                    label="Observações da Parição"
                    variant="outlined"
                    multiline
                    rows={5}
                    formProps={{ control, name: 'observation' }}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                onSave={handleSubmit(onSave)}
                onClose={onClose}
                saveText="Adicionar"
            />
        </DialogActions>
        <YesNoDialog
            openYesNo={!!warning}
            title={warning?.title}
            content={warning?.message}
            onYes={handleSubmit(onReplace)}
            onClose={() => setWarning(undefined)}
        />
    </Dialog>
}
