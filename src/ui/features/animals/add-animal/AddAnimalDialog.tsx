import { Control, FieldErrors, SubmitHandler, useForm } from "react-hook-form"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Typography from "@mui/material/Typography"
import { useCallback, useEffect, useState } from "react"
import { AddAnimalForm } from "./api/AddAnimalEntities"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormRadioGroup, RadioControlProps } from "@/ui/shared/form-controls/FormRadioGroup"
import { AnimalType } from "../shared/AnimalEntities"
import { REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { searchFarm, searchFather, searchMother, searchPasture } from "@/shared/GlobalApiCalls"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"

type AddAnimalProps = {
    isAddOpen: boolean
    setAddOpen: (isOpen: boolean) => void
}

interface FormStateProps {
    control: Control<AddAnimalForm, any, AddAnimalForm>
}

const MainControls = ({ control }: FormStateProps) => {

    const [sex, setSex] = useState('')
    const [typeControls, setTypeControls] = useState<RadioControlProps[]>([])

    const sexOptions: RadioControlProps[] = [
        { value: "M", label: "Macho" },
        { value: "F", label: "Fêmea" }
    ]

    useEffect(() => {
        const typeControls: RadioControlProps[] = [
            { value: AnimalType.OFFSPRING, label: sex === 'M' ? 'Bezerro/Garrote' : 'Bezerra/Novilha' },
            { value: AnimalType.DAIRY_ANIMAL, label: "Animal de Ordenha", disabled: sex === 'M' },
            { value: AnimalType.BEEF_ANIMAL, label: "Animal de Corte" },
            { value: AnimalType.REPRODUCTION_ANIMAL, label: "Animal para Reprodução" }
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
        <FormRadioGroup
            label="Sexo*"
            classname="my-4 col-span-3"
            controls={sexOptions}
            onChange={(value) => setSex(value)}
            formProps={{ control, name: 'sex', rules: { required: REQUIRED_FIELD_MSG } }}
            row
        />
        <FormRadioGroup
            label="Tipo de Animal*"
            classname="my-4 col-span-3"
            formProps={{ control, name: "type", rules: { required: REQUIRED_FIELD_MSG } }}
            controls={typeControls}
            row
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

    const [farmId, setFarmId] = useState<string[]>()
    const fetchPasture = useCallback(() => searchPasture(farmId), [farmId])

    return <div className="mt-10 flex flex-col gap-3">
        <Typography variant="h6" className="col-span-3">Outras Informações</Typography>
        <FormSearchBox
            formProps={{
                control,
                name: "fatherId",
                rules: { required: REQUIRED_FIELD_MSG }
            }}
            label="Pai*"
            searchOptions={searchFather}
        />
        <FormSearchBox
            formProps={{
                control,
                name: "motherId",
                rules: { required: REQUIRED_FIELD_MSG }
            }}
            label="Mãe*"
            searchOptions={searchMother}
        />
        <FormSearchBox
            formProps={{
                control,
                name: "farmId",
                rules: { required: REQUIRED_FIELD_MSG }
            }}
            onChange={(id) => id && setFarmId([id])}
            label="Fazenda*"
            searchOptions={searchFarm}
            className="col-span-3"

        />
        <FormSearchBox
            disabled={!farmId}
            searchOptions={fetchPasture}
            formProps={{
                control,
                name: "pastureId",
                rules: { required: REQUIRED_FIELD_MSG }
            }}
            label="Pasto*"
            className="col-span-3"

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
