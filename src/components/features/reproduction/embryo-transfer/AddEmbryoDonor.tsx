import { DialogActionButtons, DialogContainer } from "@shared/dialog/DialogComponents"
import { SearchBox } from "@shared/common/SearchBox"
import { Alert, AlertTitle, Collapse, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import { useState } from "react"
import { APIError } from "@utils/ApiRequest"
import { REQUIRED_FIELD_MSG } from "@shared/Globals"
import { searchNonEmbryoDonors, updateAsEmbryoDonor } from "./Controller"

type AddEmbryoDonorProps = {
    addEmbryoDonorOpen: boolean
    closeAddEmbryoDonor: (added?: boolean) => void
}

export function AddEmbryoDonorDialog({ addEmbryoDonorOpen, closeAddEmbryoDonor }: AddEmbryoDonorProps) {

    const [reload, setReload] = useState(0)
    const [donorId, setDonorId] = useState<string>()
    const [added, setAdded] = useState(false)
    const [searchError, setSearchError] = useState(false)
    const [error, setError] = useState<APIError>()

    return <Dialog
        open={addEmbryoDonorOpen}
        onClose={() => {
            setDonorId(undefined)
            closeAddEmbryoDonor(added)
        }}
    >
        <DialogTitle>Adicionar Doadora de Embrião</DialogTitle>
        <DialogContent>
            <DialogContainer>
                <Collapse in={!!error}>
                    <Alert severity="error" onClose={() => setError(undefined)}>
                        <AlertTitle>{error?.title}</AlertTitle>
                        {error?.message}
                    </Alert>
                </Collapse>
                <SearchBox
                    value={donorId}
                    reload={reload}
                    className="w-[400px]"
                    label="*Vaca"
                    searchOptions={searchNonEmbryoDonors}
                    error={searchError}
                    helperText={searchError ? REQUIRED_FIELD_MSG : undefined}
                    onChange={(id) => {
                        if (!id) return
                        setSearchError(false)
                        setDonorId(id)
                    }}
                />
            </DialogContainer>
        </DialogContent>
        <DialogActions>
            <DialogActionButtons
                onSave={() => {
                    if (!donorId) {
                        setSearchError(true)
                        return
                    }
                    updateAsEmbryoDonor(donorId)
                        .then(() => {
                            setDonorId(undefined)
                            setError(undefined)
                            setReload(prev => prev + 1)
                            setAdded(true)
                        })
                        .catch(err => setError(err))
                }}
                saveText="Adicionar"
                onClose={closeAddEmbryoDonor}
            />
        </DialogActions>
    </Dialog>

}
