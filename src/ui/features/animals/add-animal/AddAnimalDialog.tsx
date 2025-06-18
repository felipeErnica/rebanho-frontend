import { Control, Controller, FieldErrors, SubmitHandler, useForm } from "react-hook-form"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { searchFather, searchMother } from "./api/AddAnimalController"
import { FormSearchBox } from "../../../components/form-controls/FormSearchBox"
import { AddAnimalForm } from "./api/AddAnimalEntities"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import { FormTextField } from "@/ui/components/form-controls/FormTextField"
import { FormDatePicker } from "@/ui/components/form-controls/FormDatePicker"
import { FormRadioGroup, RadioControlProps } from "@/ui/components/form-controls/FormRadioGroup"

type AddAnimalProps = {
    isAddOpen: boolean
    setAddOpen: (isOpen: boolean) => void
}

interface FormStateProps {
    control: Control<AddAnimalForm, any, AddAnimalForm>
}

const REQUIRED_FIELD_MSG = 'Este campo é obrigatório!'

const MainControls = ({ control }: FormStateProps) => {

    const [sex, setSex] = useState('')
    const [typeControls, setTypeControls] = useState<RadioControlProps[]>([])

    useEffect(() => {
        const typeControls: RadioControlProps[] = [
            { value: "OFFSPRING", label: sex === 'M' ? 'Bezerro/Garrote' : 'Bezerra/Novilha' },
            { value: "DAIRY_CATTLE", label: "Animal de Ordenha", disabled: sex === 'M' },
            { value: "BEEF_CATTLE", label: "Animal de Corte" },
            { value: "REPRODUCTION_ANIMALS", label: "Animal para Reprodução" }
        ]
        setTypeControls(typeControls)
    }, [sex])


    return <div className="grid grid-cols-3 gap-y-3 gap-x-2">
        <Typography variant="h6" className="col-span-3">Informações Principais</Typography>
        <FormTextField
            label="Brinco*"
            formProps={{
                control,
                name: "ringNumber",
                rules: { required: REQUIRED_FIELD_MSG }
            }}
        />
        <FormTextField
            label="Nome*"
            classname="col-span-2"
            formProps={{
                control,
                name: "name",
                rules: { required: REQUIRED_FIELD_MSG }
            }}
        />
        <Controller
            name="sex"
            control={control}
            rules={{ required: REQUIRED_FIELD_MSG }}
            render={({ field, fieldState: { error } }) => (
                <FormControl error={!!error} className="my-4 col-span-3">
                    <FormLabel>Sexo*</FormLabel>
                    <FormHelperText>{error?.message}</FormHelperText>
                    <RadioGroup
                        {...field}
                        onChange={(event) => {
                            field.onChange(event.target.value)
                            setSex(event.target.value)
                        }}
                        row
                    >
                        <FormControlLabel value="M" label="Macho" control={<Radio />} />
                        <FormControlLabel value="F" label="Fêmea" control={<Radio />} />
                    </RadioGroup>
                </FormControl>
            )}
        />
        <FormRadioGroup
            label="Tipo de Animal*"
            classname="my-4 col-span-3"
            formProps={{ control, name: "type", rules: { required: REQUIRED_FIELD_MSG } }}
            controls={typeControls}
            row
            colNumbers={2}
        />
        <FormTextField
            label="Raça do Animal"
            classname="col-span-2"
            formProps={{
                control,
                name: "color",
            }}
        />
        <FormDatePicker
            label="Data de Nascimento"
            className="col-span-2"
            formProps={{
                control,
                name: "birthDate"
            }}
        />
        <FormDatePicker
            label="Data de Chegada*"
            className="col-span-2"
            formProps={{
                control,
                name: "entryDate",
                rules: { required: REQUIRED_FIELD_MSG }
            }}
        />
    </div>
}

const OtherControls = ({ control }: FormStateProps) => {

    return <div className="mt-10 flex flex-col gap-3">
        <Typography variant="h6" className="col-span-3">Outras Informações</Typography>
        <FormSearchBox
            name="fatherId"
            control={control}
            required={REQUIRED_FIELD_MSG}
            label="Pai*"
            fetchOptions={searchFather}
        />
        <FormSearchBox
            name="motherId"
            control={control}
            required={REQUIRED_FIELD_MSG}
            label="Mãe*"
            fetchOptions={searchMother}
        />
        <Controller
            control={control}
            name="farmId"
            //rules={{ required: true }}
            render={({ field }) => (
                <TextField
                    {...field}
                    size="small"
                    className="col-span-3"
                    label="Fazenda"
                    variant="outlined"
                />
            )}
        />
        <Controller
            control={control}
            name="pastureId"
            //rules={{ required: true }}
            render={({ field }) => (
                <TextField
                    {...field}
                    size="small"
                    className="col-span-3"
                    label="Pasto"
                    variant="outlined"
                />
            )}
        />
        <FormTextField
            label="Observações"
            multiline
            rows={4}
            maxRows={6}
            formProps={{
                control,
                name: "observation"
            }}
        />
    </div>
}

const AnimalForm = ({ control }: FormStateProps) => {
    return <div className="flex flex-col p-3">
        <MainControls {...{ control }} />
        <OtherControls {...{ control }} />
    </div>
}

export const AddAnimalDialog = ({ isAddOpen, setAddOpen }: AddAnimalProps) => {

    const { control, handleSubmit, reset } = useForm<AddAnimalForm>({ mode: 'onSubmit' })

    useEffect(() => {
        if (isAddOpen) reset()
    }, [isAddOpen, reset])

    const onSubmit: SubmitHandler<AddAnimalForm> = (data) => {
        console.log(data)
        setAddOpen(false)
    }

    const onError = (errors: FieldErrors<AddAnimalForm>) => {
        console.log('FORM ERRORS:', errors);
    };

    return <Dialog
        open={isAddOpen}
        onClose={() => setAddOpen(false)}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: handleSubmit(onSubmit, onError),
            }
        }}
    >
        <DialogTitle>Adicionar Animal</DialogTitle>
        <DialogContent>
            <AnimalForm {...{ control }} />
        </DialogContent>
        <DialogActions>
            <Button type="submit">Adicionar</Button>
            <Button onClick={() => setAddOpen(false)}>Cancelar</Button>
        </DialogActions>
    </Dialog>
}
