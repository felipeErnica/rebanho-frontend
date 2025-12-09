import { SubmitHandler, useForm } from "react-hook-form"
import { ButcherSave } from "./Entities"
import { Alert, AlertTitle, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { addButcher, replaceButcher } from "./Controller"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@/ui/shared/dialog/DialogComponents"
import { APIError } from "@/util/ApiRequest"

type AddButcherDialogProps = {
    addButcherOpen: boolean
    closeAddButcher: (added?: boolean) => void
    entryDate?: Date
}

export const AddButcherDialog = ({
    addButcherOpen,
    closeAddButcher,
}: AddButcherDialogProps) => {

    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()

    const { control, handleSubmit, reset, setFocus } = useForm<ButcherSave>()

    const onSave: SubmitHandler<ButcherSave> = (data: ButcherSave) => {
        setLoading(true)
        addButcher(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                reset()
                setFocus('name')
                setAdded(true)
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }
                setWarning(err)
            })
            .finally(() => setLoading(false))
    }

    const onReplace: SubmitHandler<ButcherSave> = (data: ButcherSave) => {
        setLoading(true)
        replaceButcher(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                reset()
                setFocus('name')
                setAdded(true)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    return <Dialog
        open={addButcherOpen}
        onClose={() => closeAddButcher(added)}
    >
        <DialogTitle>Adicionar Frigorífico</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <FormTextField
                    label="*Nome"
                    className="w-[500]"
                    formProps={{
                        control,
                        name: 'name',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormTextField
                    label="Endereço"
                    formProps={{ control, name: 'address' }}
                />
                <FormTextField
                    label="CNPJ"
                    className="w-[300]"
                    formProps={{ control, name: 'cnpj' }}
                />
                <FormTextField
                    label="Desconto Padrão"
                    className="w-[300]"
                    type="number"
                    formProps={{ control, name: 'discount' }}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Adicionar"
                onSave={handleSubmit(onSave)}
                onClose={() => closeAddButcher(added)}
            />
        </DialogActions>
        <YesNoDialog  
            openYesNo={!!warning}
            title={warning?.title}
            content={warning?.message}
            onClose={() => setWarning(undefined)}
            onYes={handleSubmit(onReplace)}
        />
    </Dialog>

}
