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
import { addLactation } from "./Service"
import { useForm, useWatch } from "react-hook-form"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { APIError } from "@utils/ApiRequest"
import { CONFLICT_WARNING, REQUIRED_FIELD_MSG, WARNING_TYPE } from "@shared/Globals"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { LactationSave } from "./Entities"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { Pasture } from "@features/farm-area/Entities"
import { searchAnimal } from "@features/animals/Service"
import { searchPastures } from "@features/farm-area/Controller"
import { Animal, getAnimalFullLabel, getAnimalLabel } from "@features/animals/Entities"

type StartLacDialogProps = {
    openStartLac: boolean
    closeStartLac: (changed?: boolean) => void
}

export const AddLactationDialog = ({ openStartLac, closeStartLac }: StartLacDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()
    const [loading, setLoading] = useState(false)
    const [changed, setChanged] = useState(false)

    const [loadingSearch, setLoadingSearch] = useState(false)
    const [pastures, setPastures] = useState<Pasture[]>([])
    const [dryAnimals, setDryAnimals] = useState<Animal[]>([])
    const [calves, setCalves] = useState<Animal[]>([])

    useEffect(() => {
        setLoadingSearch(true)
        Promise.all([
            searchAnimal({
                isFiltered: true,
                isOutsideAnimal: false,
                types: ['DAIRY_ANIMAL'],
                isLactating: false,
            }),
            searchAnimal({
                isFiltered: true,
                isOutsideAnimal: false
            }),
            searchPastures()
        ])
            .then(values => {
                setDryAnimals(values[0])
                setCalves(values[1])
                setPastures(values[2])
            })
            .catch(() => {
                setDryAnimals([])
                setCalves([])
                setPastures([])
            })
            .finally(() => setLoadingSearch(false))
    }, [])

    const { control, handleSubmit, reset, setValue } = useForm<LactationSave>({
        defaultValues: {
            transferPasture: false,
            overwrite: false,
            noBirth: false,
            noPasture: false
        }
    })

    const noBirth = useWatch({ control, name: 'noBirth' })
    const noPasture = useWatch({ control, name: 'noPasture' })

    const onSubmit = useCallback((data: LactationSave) => {
        setLoading(true)
        addLactation(data)
            .then(() => {
                reset({
                    startDate: data.startDate,
                    pastureId: data.pastureId,
                    transferPasture: false,
                    overwrite: false
                })
                setChanged(true)
                setError(undefined)
                setWarning(undefined)
            })
            .catch((err: APIError) => {
                if (err.errType === WARNING_TYPE) {
                    setWarning(err)
                    return
                }
                setError(err)
            })
            .finally(() => setLoading(false))
    }, [reset])

    const onSave = handleSubmit(onSubmit)

    return <Dialog open={openStartLac} onClose={() => closeStartLac(changed)}>
        <DialogTitle>Adicionar Novas Lactações</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    label="Data de Início"
                    disableFuture
                    className="w-[150px]"
                    formProps={{
                        control,
                        name: 'startDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <div className="flex flex-col">
                    <FormSearchBox
                        label="Pasto"
                        formProps={{
                            control,
                            name: 'pastureId',
                            disabled: noPasture
                        }}
                        loading={loadingSearch}
                        options={pastures.map(item => ({
                            id: item.id,
                            label: item.name
                        }))}
                    />
                    <FormControlLabel
                        label="Sem mudança de Lote"
                        control={(
                            <Checkbox
                                checked={noPasture}
                                onChange={(_, checked) => setValue('noPasture', checked)}
                            />
                        )}
                    />
                </div>
                <FormSearchBox
                    formProps={{
                        control,
                        name: 'animalId',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                    label="Vaca"
                    loading={loadingSearch}
                    className="w-[400px]"
                    options={dryAnimals.map(item => ({
                        id: item.id,
                        label: getAnimalLabel(item)
                    }))}
                />
                <div className="flex flex-col">
                    <FormSearchBox
                        label="Bezerro"
                        loading={loadingSearch}
                        formProps={{
                            disabled: noBirth,
                            control,
                            name: 'calfId',
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}
                        className="w-[400px]"
                        options={calves.map(item => ({
                            id: item.id,
                            label: getAnimalFullLabel(item)
                        }))}
                    />
                    <FormControlLabel
                        className="col-span-2"
                        label="Lactação s/ Bezerro"
                        control={(
                            <Checkbox
                                checked={noBirth}
                                onChange={(_, checked) => setValue('noBirth', checked)}
                            />
                        )}
                    />
                </div>
                <FormTextField
                    label="Observações"
                    variant="outlined"
                    formProps={{ name: 'observation', control }}
                    multiline
                    maxRows={5}
                    rows={5}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                saveText="Adicionar"
                onSave={onSave}
                onClose={() => {
                    reset()
                    closeStartLac(changed)
                }}
            />
        </DialogActions>
        <YesNoDialog
            openYesNo={!!warning}
            title={warning.title}
            message={warning.message}
            onClose={() => setWarning(undefined)}
            onYes={() => {
                if (warning.kind == CONFLICT_WARNING) {
                    setValue('id', warning.replacingId)
                    setValue('overwrite', true)
                }
                if (warning.kind == "PastureWarning") {
                    setValue('transferPasture', true)
                }
                onSave()
            }}
        />
    </Dialog>

}
