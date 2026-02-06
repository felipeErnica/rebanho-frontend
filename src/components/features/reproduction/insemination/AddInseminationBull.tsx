import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { Alert, AlertTitle, Collapse, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import { DialogActionButtons, DialogContainer } from "@shared/dialog/DialogComponents"
import { SearchBox } from "@shared/dialog/SearchBox"
import { REQUIRED_FIELD_MSG } from "@shared/Globals"
import { APIError } from "@utils/ApiRequest"
import { useEffect, useState } from "react"
import { searchNonInseminationBulls, setAsInseminationBull } from "./Service"

type AddInseminationBullProps = {
    addInseminationBull: boolean
    closeAddInseminationBull: (added?: boolean) => void
}

export function AddInseminationBullDialog({ addInseminationBull, closeAddInseminationBull }: AddInseminationBullProps) {

    const [reload, setReload] = useState(0)
    const [bulls, setBulls] = useState<Animal[]>([])

    const [bullId, setBullId] = useState<string>()
    const [added, setAdded] = useState(false)
    const [searchError, setSearchError] = useState(false)
    const [error, setError] = useState<APIError>()

    useEffect(() => {
        searchNonInseminationBulls()
            .then(response => setBulls(response))
            .catch(() => setBulls([]))
    }, [reload])

    return <Dialog
        open={addInseminationBull}
        onClose={() => {
            setBullId(undefined)
            closeAddInseminationBull(added)
        }}
    >
        <DialogTitle>Adicionar Touro de Inseminação</DialogTitle>
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

                    const bull = bulls.find(item => item.id === bullId)

                    setAsInseminationBull(bull)
                        .then(() => {
                            setBullId(undefined)
                            setError(undefined)
                            setReload(prev => prev + 1)
                            setAdded(true)
                        })
                        .catch(err => setError(err))
                }}
                saveText="Adicionar"
                onClose={closeAddInseminationBull}
            />
        </DialogActions>
    </Dialog>

}
