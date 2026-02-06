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
import { SubmitHandler, useForm } from "react-hook-form"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { CONFLICT_WARNING, REQUIRED_FIELD_MSG, ERROR_TYPE } from "@shared/Globals"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { useEffect, useState } from "react"
import { MilkEntrySave } from "./Entities"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { APIError } from "@utils/ApiRequest"
import { addMilkEntry } from "./Service"
import { Pasture } from "@features/farm-area/Entities"
import { searchAnimal } from "@features/animals/Service"
import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { searchPastures } from "@features/farm-area/Service"

type AddTestDialogProps = {
    addMilkEntryOpen: boolean
    onClose: (added: boolean) => void
    entryDate?: Date
}

export const AddMilkEntryDialog = ({ addMilkEntryOpen, onClose, entryDate }: AddTestDialogProps) => {

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const [noPasture, setNoPasture] = useState(false)

    const [loadingSearch, setLoadingSearch] = useState(false)
    const [animals, setAnimals] = useState<Animal[]>([])
    const [pastures, setPastures] = useState<Pasture[]>([])

    useEffect(() => {
        setLoadingSearch(true)
        Promise.all([
            searchAnimal({ isFiltered: true, isOutsideAnimal: false, types: ['DAIRY_ANIMAL'] }),
            searchPastures()
        ])
            .then(values => {
                setAnimals(values[0])
                setPastures(values[1])
            })
            .catch(() => {
                setAnimals([])
                setPastures([])
            })
            .finally(() => setLoadingSearch(false))
    }, [])

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        setFocus
    } = useForm<MilkEntrySave>({ defaultValues: { entryDate } })

    useEffect(() => setValue('entryDate', entryDate), [setValue, entryDate])

    const onSubmit: SubmitHandler<MilkEntrySave> = (data: MilkEntrySave) => {
        setLoading(true)
        addMilkEntry(data)
            .then(() => {
                reset({ entryDate: data.entryDate, pastureId: data.pastureId })
                setFocus('animalId')
                setAdded(true)
                setError(undefined)
                setWarning(undefined)
            })
            .catch((err: APIError) => {
                if (err.errType == ERROR_TYPE) {
                    setError(err)
                    return
                }
                setWarning(err)
            })
            .finally(() => setLoading(false))
    }

    const handleClose = () => {
        setWarning(undefined)
        setError(undefined)
        reset()
        onClose(added)
    }

    const onSave = handleSubmit(onSubmit)

    return <Dialog
        open={addMilkEntryOpen}
        onClose={handleClose}
    >
        <DialogTitle>Adicionar Marcação de Leite</DialogTitle>
        <DialogContent>
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <DialogContainer>
                <FormDatePicker
                    label="Data de Marcação"
                    className="w-[200px]"
                    disableFuture
                    formProps={{
                        control,
                        name: 'entryDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <div className="flex flex-col">
                    <FormSearchBox
                        label="Lote"
                        loading={loadingSearch}
                        options={pastures.map(item => ({
                            id: item.id,
                            label: item.name
                        }))}
                        formProps={{
                            control,
                            name: 'pastureId',
                            rules: { required: REQUIRED_FIELD_MSG },
                            disabled: noPasture
                        }}
                    />
                    <FormControlLabel
                        label="Não informar Lote"
                        control={(
                            <Checkbox
                                checked={noPasture}
                                onChange={() => setNoPasture(prev => !prev)}
                            />
                        )}
                    />
                </div>
                <div className="flex flex-row gap-4">
                    <FormSearchBox
                        label="Vaca"
                        loading={loadingSearch}
                        className="w-[400px]"
                        options={animals.map(item => ({
                            id: item.id,
                            label: getAnimalLabel(item)
                        }))}
                        formProps={{
                            control,
                            rules: { required: REQUIRED_FIELD_MSG },
                            name: 'animalId'
                        }}
                    />
                    <FormTextField
                        label="Quantidade"
                        type="number"
                        className="w-[100px]"
                        formProps={{
                            control,
                            name: 'quantity',
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}
                    />
                </div>
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                loading={loading}
                onClose={handleClose}
                onSave={onSave}
                saveText="Marcar Leite"
            />
        </DialogActions>
        <YesNoDialog
            openYesNo={!!warning}
            title={warning?.title}
            message={warning?.message}
            onClose={() => setWarning(undefined)}
            onYes={() => {
                if (warning.kind === CONFLICT_WARNING) {
                    setValue('overwrite', true)
                } else if (warning.kind === "PastureWarning") {
                    setValue('transferPasture', true)
                }
                onSave()
            }}
        />
    </Dialog>
}
