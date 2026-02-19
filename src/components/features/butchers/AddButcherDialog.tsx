import { SubmitHandler, useForm } from "react-hook-form"
import { Alert, AlertTitle, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { APIError } from "@utils/ApiRequest"
import { ButcherSave } from "./Entities"
import { addButcher } from "./Service"

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

    const { control, handleSubmit, reset, setFocus, setValue } = useForm<ButcherSave>()

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

    const applyMask = (input: string) => {
        const onlyNumbers = input.replace(/\D/, "")
        const cnpjMask = onlyNumbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
        setValue('cnpj', cnpjMask)
    }

    return <Dialog
        open={addButcherOpen}
        onClose={() => {
            reset()
            closeAddButcher(added)
        }}
    >
        <DialogTitle>Adicionar Frigorífico</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert severity="error" onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <FormTextField
                    label="*Nome"
                    className="w-[500px]"
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
                    className="w-[300px]"
                    onChange={applyMask}
                    formProps={{
                        control,
                        name: 'cnpj',
                        rules: { pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/ }
                    }}
                />
                <FormTextField
                    label="Taxa de Perda Padrão"
                    className="w-[300px]"
                    type="number"
                    formProps={{
                        control,
                        name: 'discount',
                        rules: { min: 0, max: 100 }
                    }}
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
            message={warning?.message}
            onClose={() => setWarning(undefined)}
            onYes={() => {
                setValue('ignoreAddress', true)
                handleSubmit(onSave)
            }}
        />
    </Dialog>

}
