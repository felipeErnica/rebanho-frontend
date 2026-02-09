import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import {
    Alert,
    AlertTitle,
    Box,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
} from "@mui/material"
import { SubmitHandler, useForm, useWatch } from "react-hook-form"
import { BirthEntrySave } from "./Entities"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { FormRadioGroup } from "@shared/form-controls/FormRadioGroup"
import { DialogActionButtons, DialogContainer, YesNoDialog } from "@shared/dialog/DialogComponents"
import { useCallback, useEffect, useState } from "react"
import { addBirth, getPotentialFather } from "./Service"
import { APIError } from "@utils/ApiRequest"
import { CONFLICT_WARNING, ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { searchFathers, searchMothers } from "@features/animals/Service"
import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { getPastureLabel, Pasture } from "@features/farm-area/Entities"
import { searchPastures } from "@features/farm-area/Service"

type AddBirthDialogProps = {
    addBirthOpen: boolean
    closeBirthDialog: (added?: boolean) => void
}

export const AddBirthDialog = ({ addBirthOpen, closeBirthDialog }: AddBirthDialogProps) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()
    const [added, setAdded] = useState(false)

    const [fathers, setFathers] = useState<Animal[]>([])
    const [mothers, setMothers] = useState<Animal[]>([])
    const [pastures, setPastures] = useState<Pasture[]>([])

    const { handleSubmit, control, reset, setValue, getValues, setFocus } = useForm<BirthEntrySave>()

    useEffect(() => {
        setLoading(true)
        Promise.all([
            searchMothers(),
            searchFathers(),
            searchPastures()
        ])
            .then(values => {
                setMothers(values[0])
                setFathers(values[1])
                setPastures(values[2])
                setFocus('motherId')
            })
            .catch(() => {
                setFathers([])
                setMothers([])
                setPastures([])
            })
            .finally(() => setLoading(false))
    }, [setFocus])

    const onClose = useCallback(() => {
        reset()
        setError(undefined)
        setWarning(undefined)
        closeBirthDialog(added)
    }, [added, closeBirthDialog, reset])

    const onSave: SubmitHandler<BirthEntrySave> = useCallback((data: BirthEntrySave) => {
        setLoading(true)
        addBirth(data)
            .then(() => {
                setError(undefined)
                setWarning(undefined)
                setAdded(true)
                reset()
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                } else {
                    setWarning(err)
                }
            })
            .finally(() => setLoading(false))
    }, [reset])


    const getFatherId = useCallback(() => {
        const motherId = getValues('motherId')
        const birthDate = getValues('birthDate')

        if (!motherId || !birthDate) return
        getPotentialFather(motherId, birthDate)
            .then((response: BirthEntrySave) => setValue('fatherId', response.fatherId))
    }, [getValues, setValue])

    const noPasture = useWatch({ control, name: 'noPasture' })

    return <>
        <Dialog
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
                    <FormSearchBox
                        label="Mãe*"
                        options={mothers.map(item => ({
                            id: item.id,
                            label: getAnimalLabel(item)
                        }))}
                        className="w-100"
                        onChange={(id) => {
                            getFatherId()
                            const mother = mothers.find(item => item.id === id)
                            if (!mother) return
                            setValue('tag', mother.tag)
                            setValue('pastureId', mother.pasture?.id)
                        }}
                        formProps={{
                            control,
                            name: 'motherId',
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}
                    />
                    <Box className="flex flex-row items-center gap-4">
                        <FormTextField
                            label="Brinco*"
                            className="w-[80px]"
                            formProps={{
                                control,
                                name: 'tag',
                                rules: { required: REQUIRED_FIELD_MSG }
                            }}
                        />
                        <FormDatePicker
                            label="Data de Nascimento*"
                            className="w-[250px]"
                            onBlur={getFatherId}
                            disableFuture
                            formProps={{
                                control,
                                name: 'birthDate',
                                rules: { required: REQUIRED_FIELD_MSG }
                            }}
                        />
                    </Box>
                    <FormRadioGroup
                        label="Sexo*"
                        row
                        controls={[
                            { label: 'Macho', value: 'M' },
                            { label: 'Fêmea', value: 'F' }
                        ]}
                        formProps={{
                            control,
                            name: 'sex',
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}
                    />
                    <FormSearchBox
                        label="Pai*"
                        options={fathers.map(item => ({
                            id: item.id,
                            label: getAnimalLabel(item)
                        }))}
                        formProps={{
                            control,
                            name: 'fatherId',
                            rules: { required: REQUIRED_FIELD_MSG }
                        }}
                    />
                    <Box className="flex flex-col">
                        <FormSearchBox
                            label="Pasto"
                            formProps={{
                                control,
                                name: 'pastureId',
                                disabled: noPasture,
                                rules: { required: REQUIRED_FIELD_MSG }
                            }}
                            options={pastures.map(item => ({
                                id: item.id,
                                label: getPastureLabel(item)
                            }))}
                        />
                        <FormControlLabel
                            label="Sem Pasto"
                            name="noPasture"
                            control={(
                                <Checkbox
                                    checked={noPasture}
                                    onChange={(_, checked) => setValue('noPasture', checked)}
                                />
                            )}
                        />
                    </Box>
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
        </Dialog>
        <YesNoDialog
            openYesNo={!!warning}
            title={warning?.title}
            message={warning?.message}
            onClose={() => setWarning(undefined)}
            onYes={() => {
                if (warning.kind == CONFLICT_WARNING) {
                    setValue('overwrite', true)
                } else if (warning.kind === "TagWarning") {
                    setValue('ignoreTag', true)
                }
            }}
        />
    </>
}
