import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { TestEntry } from "./Entities"
import { DialogActionButtons, DialogContainer } from "@/ui/shared/dialog/DialogComponents"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchMother } from "@/shared/GlobalApiCalls"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { FormRadioGroup } from "@/ui/shared/form-controls/FormRadioGroup"
import { useEffect, useState } from "react"

type AddTestDialogProps = {
    addTestOpen: boolean
    setAddTestOpen: (addTestOpen: boolean) => void
    testDate?: Date
}

export const AddTestDialog = ({ addTestOpen, setAddTestOpen, testDate }: AddTestDialogProps) => {

    const { handleSubmit, control, reset, setValue } = useForm<TestEntry>({
        defaultValues: { testDate }
    })

    const [disableForecast, setDisableForecast] = useState(true)

    useEffect(() => testDate && setValue('testDate', testDate), [setValue, testDate])

    const onSubmit: SubmitHandler<TestEntry> = (data: TestEntry) => {
        console.log(data)
        reset({ testDate: data.testDate })
    }

    const onClose = () => {
        reset()
        setAddTestOpen(false)
    }

    return <Dialog
        open={addTestOpen}
        onClose={onClose}
    >
        <DialogTitle>Adicionar Toque</DialogTitle>
        <DialogContent>
            <DialogContainer className="flex flex-col gap-8">
                <FormDatePicker
                    label="Data de Exame"
                    formProps={{
                        control,
                        name: 'testDate',
                        rules: { required: REQUIRED_FIELD_MSG }
                    }}
                />
                <FormSearchBox
                    label="Vaca"
                    searchOptions={searchMother}
                    formProps={{
                        control,
                        rules: { required: REQUIRED_FIELD_MSG },
                        name: 'animalId'
                    }}
                />
                <FormRadioGroup
                    label="Prenhez"
                    row
                    controls={[
                        { label: "Confirmada", value: "SUCCESS" },
                        { label: "Vazia", value: "FAILED" },
                    ]}
                    onChange={(value) => setDisableForecast(value === "FAILED")}
                    formProps={{
                        control,
                        rules: { required: REQUIRED_FIELD_MSG },
                        name: 'pregnancyStatus'
                    }}
                />
                <FormDatePicker
                    label="Data Prevista de Parição"
                    disabled={disableForecast}
                    formProps={{
                        control,
                        disabled: disableForecast,
                        rules: { required: REQUIRED_FIELD_MSG },
                        name: 'birthForecast'
                    }}
                />
                <FormTextField
                    label="Observações"
                    multiline
                    rows={5}
                    formProps={{
                        control,
                        name: 'observation'
                    }}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                onClose={onClose}
                onSave={handleSubmit(onSubmit)}
                saveText="Adicionar"
            />
        </DialogActions>
    </Dialog>
}
