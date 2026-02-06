import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import {
    Alert,
    AlertTitle,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { APIError } from "@utils/ApiRequest"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { LactationSave } from "./Entities"
import { ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { searchAnimal } from "@features/animals/Service"
import { getPastureLabel, Pasture } from "@features/farm-area/Entities"
import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { updateLactation } from "./Service"
import { searchPastures } from "@features/farm-area/Service"

type EndLactationDialogProps = {
    openEndLactation: boolean
    closeEndLactation: (changed?: boolean) => void
}

export const EndLactationDialog = ({ openEndLactation, closeEndLactation }: EndLactationDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()
    const [changed, setChanged] = useState(false)
    const [loading, setLoading] = useState(false)

    const [loadingSearch, setLoadingSearch] = useState(false)
    const [pastures, setPastures] = useState<Pasture[]>([])
    const [lacAnimals, setLacAnimals] = useState<Animal[]>([])

    useEffect(() => {
        setLoadingSearch(true)
        Promise.all([
            searchAnimal({
                isFiltered: true,
                isOutsideAnimal: false,
                types: ['DAIRY_ANIMAL'],
                isLactating: true,
            }),
            searchPastures()
        ])
            .then(values => {
                setLacAnimals(values[0])
                setPastures(values[1])
            })
            .catch(() => {
                setLacAnimals([])
                setPastures([])
            })
            .finally(() => setLoadingSearch(false))
    }, [])

    const { control, handleSubmit, reset, setValue } = useForm<LactationSave>({
        defaultValues: {
            transferPasture: false,
            overwrite: false,
            noPasture: false,
        }
    })

    const onSubmit = useCallback((data: LactationSave) => {
        setLoading(true)
        updateLactation(data)
            .then(() => {
                reset({
                    endDate: data.endDate,
                    transferPasture: false
                })
                setChanged(true)
            })
            .catch((error: APIError) => {
                if (error.errType === ERROR_TYPE) {
                    setError(error)
                    return
                }
                setWarning(error)
            })
            .finally(() => setLoading(false))
    }, [reset])

    const onSave = handleSubmit(onSubmit)
    const noPasture = useWatch({ control, name: 'noPasture' })

    return <Dialog open={openEndLactation} onClose={() => closeEndLactation(changed)}>
        <DialogTitle>Secar Vacas</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    className="w-[200px]"
                    label="Data da Secagem"
                    disableFuture
                    formProps={{ control, name: 'endDate' }}
                />
                <div className="flex flex-col">
                    <FormSearchBox
                        label="Transferir para"
                        loading={loadingSearch}
                        options={pastures.map(item => ({
                            id: item.id,
                            label: getPastureLabel(item)
                        }))}
                        formProps={{
                            control,
                            name: 'pastureId',
                            disabled: noPasture,
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}

                    />
                    <FormControlLabel
                        label="Não transferir"
                        control={(
                            <Checkbox
                                checked={noPasture}
                                onChange={(_, checked) => setValue('noPasture', checked)}
                            />
                        )}
                    />
                </div>
                <FormSearchBox
                    formProps={{ control, name: 'id' }}
                    className="w-[400px]"
                    label="Vaca"
                    options={lacAnimals.map(item => ({
                        id: item.id,
                        label: getAnimalLabel(item)
                    }))}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Secar Vacas"
                onSave={onSave}
                onClose={() => {
                    reset()
                    closeEndLactation(changed)
                }}
            />
        </DialogActions>
        <YesNoDialog
            openYesNo={!!warning}
            title={warning?.title}
            message={warning?.message}
            onClose={() => setWarning(undefined)}
            onYes={() => {
                setValue('transferPasture', true)
                onSave()
            }}
        />
    </Dialog>

}
