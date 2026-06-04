import {
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableHeadCell,
    TableHeadControlCell,
    TablePageContainer,
    TrendValues
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { Slaughter, SlaughterGroup } from "./Entities"
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { deleteSlaughterBatch, findEntries, findGroups } from "./Service"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableBody from "@mui/material/TableBody"
import { EditControlButtons } from "@shared/table/ControlButtons"
import { dateToISO, dateTransform, decimalTransform, toPercentage } from "@utils/Transformations"
import { useNavigate } from "react-router"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { DefaultTimerWarning, DefaultWarning, GROUP_DELETE_TITLE } from "@shared/Globals"
import { APIError } from "@utils/ApiRequest"

type TableContextProps = {
    setReload: Dispatch<SetStateAction<number>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarning: Dispatch<SetStateAction<YesNoDialogProps>>
    setTimerWarning: Dispatch<SetStateAction<TimerYesNoDialogProps>>
}

const TableContext = createContext<TableContextProps>(undefined!)

export const SlaughterGroupsTable = () => {

    const [rows, setRows] = useState<SlaughterGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState('desc')
    const [reload, setReload] = useState(0)
    const [warning, setWarning] = useState<YesNoDialogProps>(DefaultWarning)
    const [timerWarning, setTimerWarning] = useState(DefaultTimerWarning)
    const [error, setError] = useState<APIError>()

    const onReload = useCallback(() => {
        setLoading(true)
        findGroups(order)
            .then(results => setRows(results))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [order])

    useEffect(onReload, [reload])

    return <TablePageContainer>
        <TableTopBar
            reloadProps={{ onReload }}
            orderProps={{ setOrder, order }}
        />
        <TableContext.Provider value={{ setReload, setWarning, setError, setTimerWarning }} >
            <GroupTable {...{ rows, loading }} />
        </TableContext.Provider>
        <YesNoDialog {...warning} />
        <TimerYesNoDialog {...timerWarning} />
        <ErrorDialog 
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
    </TablePageContainer>
}

type GroupTableProps = {
    loading: boolean
    rows: SlaughterGroup[]
}

const COLUMN_COUNT = 7

const GroupTable = ({ rows, loading }: GroupTableProps) => {

    return <div className="overflow-auto">
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadControlCell />
                    <TableHeadCell>Data</TableHeadCell>
                    <TableHeadCell width={300}>Frigorífico</TableHeadCell>
                    <TableHeadCell align="center" width={280}>Nº de Animais</TableHeadCell>
                    <TableHeadCell align="center" width={280}>Peso</TableHeadCell>
                    <TableHeadCell align="center" width={280}>Peso de Abate</TableHeadCell>
                    <TableHeadCell align="center" width={280}>Rendimento</TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    colSpan={COLUMN_COUNT}
                    loading={loading}
                    dataset={rows}
                    render={row => <GroupRow {...row} />}
                />
            </TableBody>
        </Table>
    </div>
}

const GroupRow = (row: SlaughterGroup) => {

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { setReload, setError, setTimerWarning } = useContext(TableContext)

    const onDelete = useCallback(() => {
        setLoading(true)
        findEntries({ isFiltered: true, minEntryDate: row.entryDate, maxEntryDate: row.entryDate })
            .then((resp: Slaughter[]) => {
                const ids = resp.map(item => item.id)
                deleteSlaughterBatch(ids)
                    .then(() => setReload(prev => prev + 1))
                    .catch(err => setError(err))
            })
            .finally(() => setLoading(false))
    }, [])

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                loading={loading}
                onDelete={() => {
                    setTimerWarning({
                        title: GROUP_DELETE_TITLE,
                        message: `ATENÇÃO: Ao continuar, ${row.animalsNumber} registros serão excluídos e os animais abatidos terão a data de morte excluídas!`,
                        openYesNo: true,
                        onYes: onDelete,
                        onClose: () => setTimerWarning(DefaultTimerWarning),
                    })
                }}
                onShow={() => {
                    const entryDate = new Date(row.entryDate)
                    const dateStr = dateToISO(entryDate)
                    navigate(`${dateStr}`)
                }}
            />
        </TableBodyCell>
        <TableBodyCell>{dateTransform(row.entryDate)}</TableBodyCell>
        <TableBodyCell>{row.butcher.name}</TableBodyCell>
        <TableBodyCell align="center">{row.animalsNumber}</TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={decimalTransform(row.averageWeight)}
                trendProps={{ trend: row.weightVariation }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={decimalTransform(row.averageDeadWeight)}
                trendProps={{ trend: row.deadWeightVariation }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={toPercentage(row.averageRate)}
                trendProps={{ trend: row.rateVariation }}
            />
        </TableBodyCell>
    </TableBodyRow>
}
