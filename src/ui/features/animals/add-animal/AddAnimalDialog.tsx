import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { FormEvent, useState } from "react"

type AddAnimalProps = {
    isAddOpen: boolean
    setAddOpen: (isOpen: boolean) => void
}

type MainControlsProps = {
    sex: string
    setSex: (sex: string) => void
}

const MainControls = ({ sex, setSex }: MainControlsProps) => {
    return <div className="grid grid-cols-3 gap-y-3 gap-x-2">
        <Typography variant="h6" className="col-span-3">Informações Principais</Typography>
        <TextField
            id="ringNumber"
            name="ringNumber"
            required
            label="Brinco"
            variant="outlined"
            size="small"
            fullWidth
        />
        <TextField
            id="name"
            name="name"
            size="small"
            required
            label="Nome do Animal"
            variant="outlined"
            className="col-span-2"
            fullWidth
        />
        <FormControl required className="my-4 col-span-3">
            <FormLabel>Sexo</FormLabel>
            <RadioGroup id="sex" name="sex" onChange={(event) => setSex(event.target.value)} row>
                <FormControlLabel value="M" label="Macho" control={<Radio />} />
                <FormControlLabel value="F" label="Fêmea" control={<Radio />} />
            </RadioGroup>
        </FormControl>
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

const OtherControls = () => {
    return <div className="mt-10 flex flex-col gap-3">
        <Typography variant="h6" className="col-span-3">Outras Informações</Typography>
        <TextField
            id="father"
            name="father"
            size="small"
            label="Pai"
            variant="outlined"
            fullWidth
        />
        <TextField
            id="mother"
            name="mother"
            size="small"
            label="Mãe"
            variant="outlined"
            fullWidth
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
            maxRows={4}
            variant="outlined"
        />
    </div>

}

const AnimalForm = () => {

    const [sex, setSex] = useState('')

    return <div className="flex flex-col p-3">
        <MainControls {...{ sex, setSex }} />
        <OtherControls />
    </div>
}

export const AddAnimalDialog = ({ isAddOpen, setAddOpen }: AddAnimalProps) => {
    return <Dialog
        open={isAddOpen}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault()
                    const formData = new FormData(event.currentTarget)
                    const obj = Object.fromEntries(formData.entries())
                    console.log(obj)
                    setAddOpen(false)
                }
            }
        }}
    >
        <DialogTitle>Adicionar Animal</DialogTitle>
        <DialogContent>
            <AnimalForm />
        </DialogContent>
        <DialogActions>
            <Button type="submit">Adicionar</Button>
            <Button onClick={() => setAddOpen(false)} >Cancelar</Button>
        </DialogActions>
    </Dialog>
}
