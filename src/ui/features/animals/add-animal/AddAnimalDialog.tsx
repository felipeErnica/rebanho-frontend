import { Control, Controller, SubmitHandler, useForm, UseFormRegister } from "react-hook-form"
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { useState } from "react"
import { searchFather, searchMother } from "./api/AddAnimalController"
import { ParentsSearchBox } from "./ParentSearchBox"
import { AnimalSave } from "./api/AddAnimalEntities"
import FormControl from "@mui/material/FormControl"

type AddAnimalProps = {
    isAddOpen: boolean
    setAddOpen: (isOpen: boolean) => void
}

interface FormStateProps {
    control: Control<AnimalSave, any, AnimalSave>
}

const MainControls = ({ control }: FormStateProps) => {

    const [sex, setSex] = useState('')

    return <div className="grid grid-cols-3 gap-y-3 gap-x-2">
        <Typography variant="h6" className="col-span-3">Informações Principais</Typography>
        <Controller
            name="ringNumber"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Brinco"
                    variant="outlined"
                    size="small"
                    fullWidth
                />
            )}
        />
        <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <TextField
                    {...field}
                    size="small"
                    required
                    label="Nome do Animal"
                    variant="outlined"
                    className="col-span-2"
                    fullWidth
                />
            )}
        />
        <Controller
            name="sex"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <FormControl required className="my-4 col-span-3">
                    <FormLabel>Sexo</FormLabel>
                    <RadioGroup id="sex" name="sex" onChange={(event) => setSex(event.target.value)} row>
                        <FormControlLabel value="M" label="Macho" control={<Radio />} />
                        <FormControlLabel value="F" label="Fêmea" control={<Radio />} />
                    </RadioGroup>
                </FormControl>
            )}
        />
        <FormControl required className="my-4 col-span-3">
            <FormLabel>Tipo de Animal</FormLabel>
            <RadioGroup id="type" name="type" row>
                <FormControlLabel
                    value="OFFSPRING"
                    label={sex === 'M' ? 'Bezerro/Garrote' : 'Bezerra/Novilha'}
                    control={<Radio />}
                />
                <FormControlLabel value="BEEF_CATTLE" label="Animal de Corte" control={<Radio />} />
                <FormControlLabel
                    value="DAIRY_CATTLE"
                    label="Animal de Ordenha"
                    control={<Radio />}
                    disabled={sex === 'M'}
                />
                <FormControlLabel value="REPRODUCTION_ANIMALS" label="Animal para Reprodução" control={<Radio />} />
            </RadioGroup>
        </FormControl>
        <TextField
            id="color"
            name="color"
            size="small"
            className="col-span-2"
            label="Raça do Animal"
            variant="outlined"
        />
        <DatePicker
            label="Data de Nascimento"
            className="col-span-2"
            views={['year', 'month', 'day']}
            localeText={{
                fieldDayPlaceholder: () => 'dd',
                fieldMonthPlaceholder: () => 'mm',
                fieldYearPlaceholder: () => 'aaaa',
            }}
            slotProps={{
                textField: { size: "small", },
                field: { clearable: true }
            }}
        />
        <DatePicker
            label="Chegada do Animal"
            className="col-span-2"
            views={['year', 'month', 'day']}
            localeText={{
                fieldDayPlaceholder: () => 'dd',
                fieldMonthPlaceholder: () => 'mm',
                fieldYearPlaceholder: () => 'aaaa',
            }}
            slotProps={{
                textField: { size: "small", required: true },
                field: { clearable: true }
            }}
        />
    </div>
}

const OtherControls = ({ control }: FormStateProps) => {

    return <div className="mt-10 flex flex-col gap-3">
        <Typography variant="h6" className="col-span-3">Outras Informações</Typography>
        <ParentsSearchBox
            label="Pai"
            name="fatherId"
            fetchOptions={searchFather}
        />
        <ParentsSearchBox
            label="Mãe"
            fetchOptions={searchMother}
        />
        <TextField
            id="farm"
            name="farm"
            size="small"
            className="col-span-3"
            label="Fazenda"
            variant="outlined"
            required
        />
        <TextField
            id="pasture"
            name="pasture"
            required
            size="small"
            className="col-span-3"
            label="Pasto"
            variant="outlined"
        />
        <TextField
            id="observation"
            name="observation"
            className="col-span-3"
            label="Observações"
            multiline
            rows={4}
            maxRows={6}
            variant="outlined"
        />
    </div>

}

const AnimalForm = ({ control }: FormStateProps) => {
    return <div className="flex flex-col p-3">
        <MainControls {...{  control }} />
        <OtherControls {...{ control }} />
    </div>
}

export const AddAnimalDialog = ({ isAddOpen, setAddOpen }: AddAnimalProps) => {

    const { control, handleSubmit } = useForm<AnimalSave>()

    const onSubmit: SubmitHandler<AnimalSave> = (data) => {
        console.log(data)
    }

    return <Dialog
        open={isAddOpen}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: handleSubmit(onSubmit)
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
