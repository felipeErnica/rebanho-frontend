import { DialogActionButtons, DialogContainer } from "@shared/dialog/DialogComponents"
import { SearchBox } from "@shared/common/SearchBox"
import { Alert, AlertTitle, Collapse, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import { useEffect, useState } from "react"
import { searchBreedingBulls } from "./Service"
import { APIError } from "@utils/ApiRequest"
import { REQUIRED_FIELD_MSG } from "@shared/Globals"
import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { updateAnimal } from "@features/animals/Service"

type AddBreddingBullProps = {
    openBreedingBull: boolean
    closeAddBreedingBull: (added?: boolean) => void
}

export function AddBreddingBullDialog({ openBreedingBull, closeAddBreedingBull }: AddBreddingBullProps) {

    const [bullId, setBullId] = useState<string>()
    const [bulls, setBulls] = useState<Animal[]>([])
    const [added, setAdded] = useState(false)
    const [searchError, setSearchError] = useState(false)
    const [error, setError] = useState<APIError>()

    useEffect(() => {
        searchBreedingBulls()
            .then(response => setBulls(response))
            .catch(() => setBulls([]))
    }, [])

    return <Dialog
        open={openBreedingBull}
        onClose={() => {
            setBullId(undefined)
            closeAddBreedingBull(added)
        }}
    >
        <DialogTitle>Adicionar Touro de Cobertura</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert severity="error" onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <SearchBox
                    value={bullId}
                    className="w-[400px]"
                    label="*Touro"
                    options={bulls.map(item => ({
                        id: item.id,
                        label: getAnimalLabel(item)
                    }))}
                    error={searchError}
                    helperText={searchError ? REQUIRED_FIELD_MSG : undefined}
                    onChange={(id) => {
                        if (!id) return
                        setSearchError(false)
                        setBullId(id)
                    }}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                onSave={() => {
                    if (!bullId) {
                        setSearchError(true)
                        return
                    }

                    const entry = bulls.find(item => item.id === bullId)
                    updateAnimal({ ...entry, isBreedingBull: true, ignoreDead: false })
                        .then(() => {
                            setBullId(undefined)
                            setError(undefined)
                            setAdded(true)
                        })
                        .catch(err => setError(err))
                }}
                saveText="Adicionar"
                onClose={closeAddBreedingBull}
            />
        </DialogActions>
    </Dialog>

}
