import Add from "@mui/icons-material/Add"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { Farm, Pasture } from "./api/entities"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { useState } from "react"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { searchFarm } from "@/shared/GlobalApiCalls"
import { searchBull } from "./api/DashboardController"

export const TableFarmTopBar = () => {

    const [isAddFarmOpen, setAddFarmOpen] = useState(false)
    const [isAddPastureOpen, setAddPastureOpen] = useState(false)

    return <div className="p-4 flex flex-row-reverse gap-3">
        <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setAddPastureOpen(true)}
        >
            Adicionar Pastagem
        </Button>
        <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setAddFarmOpen(true)}
        >
            Adicionar Fazenda
        </Button>
        <AddFarmDialog  {...{ isAddFarmOpen, setAddFarmOpen }} />
        <AddPastureDialog {...{ isAddPastureOpen, setAddPastureOpen }} />
    </div>
}

type AddFarmDialogProps = {
    isAddFarmOpen: boolean
    setAddFarmOpen: (isAddFarmOpen: boolean) => void
}

const AddFarmDialog = ({ isAddFarmOpen, setAddFarmOpen }: AddFarmDialogProps) => {

    const { handleSubmit, control } = useForm<Farm>()

    const onSubmit: SubmitHandler<Farm> = (data: Farm) => {
        console.log(data)
    }

    return <Dialog open={isAddFarmOpen} onClose={() => setAddFarmOpen(false)}>
        <DialogTitle>Adicionar Fazenda</DialogTitle>
        <DialogContent>
            <FormTextField
                label="Nome da Fazenda*"
                variant="standard"
                className="w-[400] p-4"
                formProps={{
                    control,
                    rules: { required: REQUIRED_FIELD_MSG },
                    name: 'name'
                }}
            />
        </DialogContent>
        <DialogActions>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>Adicionar</Button>
            <Button onClick={() => setAddFarmOpen(false)}>Cancelar</Button>
        </DialogActions>
    </Dialog>
}

type AddPastureDialogProps = {
    isAddPastureOpen: boolean
    setAddPastureOpen: (isAddPastureOpen: boolean) => void
}

const AddPastureDialog = ({ isAddPastureOpen, setAddPastureOpen }: AddPastureDialogProps) => {

    const { handleSubmit, control } = useForm<Pasture>()

    const onSubmit: SubmitHandler<Pasture> = (data: Pasture) => {
        console.log(data)
    }

    return <Dialog open={isAddPastureOpen} onClose={() => setAddPastureOpen(false)}>
        <DialogTitle>Adicionar Pastagem</DialogTitle>
        <DialogContent>
            <div className="w-[500] p-4 grid grid-cols-3 grid-flow-row gap-6">
                <FormTextField
                    label="Nome da Pastagem*"
                    className="col-span-3"
                    formProps={{
                        control,
                        rules: { required: REQUIRED_FIELD_MSG },
                        name: 'name'
                    }}
                />
                <FormSearchBox
                    searchOptions={searchFarm}
                    className="col-span-2"
                    label="Fazenda*"
                    formProps={{
                        control,
                        rules: { required: REQUIRED_FIELD_MSG },
                        name: 'farmId'
                    }}
                />
                <FormSearchBox
                    searchOptions={searchBull}
                    className="col-start-1 col-span-2"
                    label="Touro (Opcional)"
                    formProps={{
                        control,
                        name: 'bullId'
                    }}
                />
            </div>
        </DialogContent>
        <DialogActions>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>Adicionar</Button>
            <Button onClick={() => setAddPastureOpen(false)}>Cancelar</Button>
        </DialogActions>
    </Dialog>
}
