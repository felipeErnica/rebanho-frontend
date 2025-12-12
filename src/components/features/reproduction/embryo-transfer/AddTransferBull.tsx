import { DialogActionButtons, DialogContainer } from "@shared/dialog/DialogComponents"
import { SearchBox } from "@shared/dialog/SearchBox"
import { Alert, AlertTitle, Collapse, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import { useState } from "react"
import { searchNonTransferBulls, updateAsTransferBull } from "./Controller"
import { APIError } from "@utils/ApiRequest"
import { REQUIRED_FIELD_MSG } from "@shared/Globals"

type AddTransferBullProps = {
    addTransferBullOpen: boolean
    closeAddTransferBull: (added?: boolean) => void
}

export function AddTransferBull({ addTransferBullOpen, closeAddTransferBull }: AddTransferBullProps) {

    const [reload, setReload] = useState(0)
    const [bullId, setBullId] = useState<string>()
    const [added, setAdded] = useState(false)
    const [searchError, setSearchError] = useState(false)
    const [error, setError] = useState<APIError>()

    return <Dialog
        open={addTransferBullOpen}
        onClose={() => {
            setBullId(undefined)
            closeAddTransferBull(added)
        }}
    >
        <DialogTitle>Adicionar Touro p/ Transferência</DialogTitle>
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
                    className="w-[400]"
                    label="*Touro"
                    searchOptions={searchNonTransferBulls}
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
                    setSearchError(false)
                    updateAsTransferBull(bullId)
                        .then(() => {
                            setBullId(undefined)
                            setError(undefined)
                            setReload(prev => prev + 1)
                            setAdded(true)
                        })
                        .catch(err => setError(err))
                }}
                saveText="Adicionar"
                onClose={closeAddTransferBull}
            />
        </DialogActions>
    </Dialog>

}
