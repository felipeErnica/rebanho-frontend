import { DialogActionButtons, DialogContainer } from "@shared/dialog/DialogComponents"
import { SearchBox } from "@shared/dialog/SearchBox"
import { Alert, AlertTitle, Collapse, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import { useState } from "react"
import { searchNonInseminationBulls, setAsInseminationBull } from "./Controller"
import { APIError } from "@utils/ApiRequest"
import { REQUIRED_FIELD_MSG } from "@shared/Globals"

type AddInseminationBullProps = {
    addInseminationBull: boolean
    closeAddInseminationBull: (added?: boolean) => void
}

export function AddInseminationBullDialog({ addInseminationBull, closeAddInseminationBull }: AddInseminationBullProps) {

    const [reload, setReload] = useState(0)
    const [bullId, setBullId] = useState<string>()
    const [added, setAdded] = useState(false)
    const [searchError, setSearchError] = useState(false)
    const [error, setError] = useState<APIError>()

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
                    reload={reload}
                    className="w-[400px]"
                    label="*Touro"
                    searchOptions={searchNonInseminationBulls}
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
                    setAsInseminationBull(bullId)
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
