import {
    Button,
    Collapse,
    IconButton,
    Menu,
    MenuItem,
    MenuList,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react"
import { FarmInfo, PastureInfo } from "./api/entities"
import { getFarmsInfo, getPasturesInfo, searchBull, searchBullById } from "./api/DashboardController"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { useForm } from "react-hook-form"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { ControlButtonContainer, EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { HomePage } from "../../home/HomePage"
import { FarmPage } from "../FarmPage"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow, TableLoadingRow } from "@/ui/shared/table/TableComponents"
import { FarmAnimalsPage } from "../farm-animals/FarmAnimalsPage"
import { PastureAnimalsPage } from "../pasture-animals/PastureAnimalsPage"
import { PastureEntriesPage } from "../pasture-entries/PastureEntriesPage"
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const TableInfoFarms = () => {

    const [rows, setRows] = useState<FarmInfo[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getFarmsInfo()
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [])

    return <div className="h-full w-full overflow-auto">
        <Table>
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell />
                    <TableHeadCell>Fazenda</TableHeadCell>
                    <TableHeadCell>Número de Pastagens</TableHeadCell>
                    <TableHeadCell>Número de Animais</TableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {loading ?
                    <TableLoadingRow colSpan={4} /> :
                    rows.map(row => <InfoFarmsRow {...row} />)
                }
            </TableBody>
        </Table>
    </div>
}

const InfoFarmsRow = (row: FarmInfo) => {

    const [isEditing, setEditing] = useState(false)
    const [rowValue, setRowValue] = useState(row)

    if (isEditing) return <FarmsEditRow {...{ setEditing, setRowValue, rowValue }} />
    return <FarmsNormalRow {...{ rowValue, setEditing }} />
}

type FarmsNormalRowProps = {
    rowValue: FarmInfo
    setEditing: (isEditing: boolean) => void
}

const FarmsNormalRow = ({
    rowValue: { farmName, pasturesNumber, animalsNumber, farmId },
    setEditing
}: FarmsNormalRowProps) => {

    const [isOpen, setOpen] = useState(false)
    const { setPageProps } = useContext(PageContext)

    return <>
        <TableBodyRow>
            <TableBodyCell>
                <ControlButtonContainer>
                    <IconButton onClick={() => setOpen(!isOpen)}>
                        <ChevronRight className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                    </IconButton>
                    <EditControlButtons
                        setEditing={setEditing}
                        onDelete={() => console.log("delete: ", farmName)}
                        onShow={() => {
                            const nextPage: PageProps = {
                                title: `Rebanho - ${farmName}`,
                                page: <FarmAnimalsPage {...{ farmId }} />,
                                previousPages: [HomePage, FarmPage]
                            }
                            if (setPageProps) setPageProps(nextPage)
                        }}
                    />
                </ControlButtonContainer>
            </TableBodyCell>
            <TableBodyCell> {farmName} </TableBodyCell>
            <TableBodyCell> {pasturesNumber} </TableBodyCell>
            <TableBodyCell> {animalsNumber} </TableBodyCell>
        </TableBodyRow>
        <TableRow>
            <TableCell className="p-0" colSpan={4}>
                <Collapse in={isOpen} unmountOnExit>
                    <PastureInfoTable {...{ farmId }} />
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}

type FarmsEditRowProps = {
    rowValue: FarmInfo
    setRowValue: (rowValue: FarmInfo) => void
    setEditing: (isEditing: boolean) => void
}

const FarmsEditRow = ({ rowValue, setRowValue, setEditing }: FarmsEditRowProps) => {

    const { handleSubmit, control } = useForm({
        defaultValues: rowValue
    })

    const onSubmit = (data: FarmInfo) => {
        setRowValue(data)
        setEditing(false)
    }

    return <TableRow>
        <TableBodyCell>
            <EditingControlButtons setEditing={setEditing} onSave={handleSubmit(onSubmit)} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'farmName'
                }}
            />
        </TableBodyCell>
        <TableBodyCell> {rowValue.pasturesNumber} </TableBodyCell>
        <TableBodyCell> {rowValue.animalsNumber} </TableBodyCell>
    </TableRow>
}

type PastureTableProps = {
    farmId: string
}

const PastureInfoTable = ({ farmId }: PastureTableProps) => {

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<PastureInfo[]>([])

    useEffect(() => {
        setLoading(true)
        getPasturesInfo(farmId)
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [farmId])

    return <Table size="small">
        <TableHead>
            <TableHeadRow>
                <TableHeadCell />
                <TableHeadCell>Pasto</TableHeadCell>
                <TableHeadCell>Touro</TableHeadCell>
                <TableHeadCell>Número de Animais</TableHeadCell>
            </TableHeadRow>
        </TableHead>
        <TableBody>
            {loading &&
                <TableCell colSpan={4}>
                    <Skeleton animation='pulse' variant="rectangular" />
                </TableCell>
            }
            {rows.map(row => <PastureInfoRow {...row} />)}
        </TableBody>
    </Table>
}

type EditPastureRowProps = {
    rowValue: PastureInfo
    setRowValue: (rowValue: PastureInfo) => void
    setEditing: (isEditing: boolean) => void
}

type PastureRowProps = {
    rowValue: PastureInfo
    setEditing: (isEditing: boolean) => void
}

const PastureInfoRow = (row: PastureInfo) => {

    const [isEditing, setEditing] = useState(false)
    const [rowValue, setRowValue] = useState<PastureInfo>(row)

    if (isEditing) return <EditPastureRow {...{ rowValue, setRowValue, setEditing }} />
    return <NormalPastureRow {...{ rowValue, setEditing }} />
}

const NormalPastureRow = ({ rowValue: { pastureId, pastureName, bullName, animalsNumber }, setEditing }: PastureRowProps) => {

    const [isShowMenuOpen, setShowMenuOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={() => console.log("delete: ", pastureName)}
                otherButtons={(
                    <IconButton
                        onClick={() => setShowMenuOpen(true)}
                        ref={buttonRef}
                    >
                        <MoreVertIcon />
                    </IconButton>
                )}
            />
        </TableBodyCell>
        <TableBodyCell>{pastureName}</TableBodyCell>
        <TableBodyCell>{bullName || 'SEM TOURO'}</TableBodyCell>
        <TableBodyCell>{animalsNumber}</TableBodyCell>
        <PastureShowMenu {...{
            pastureId,
            pastureName,
            isShowMenuOpen,
            setShowMenuOpen,
            anchorEl: buttonRef.current ?? undefined
        }} />
    </TableBodyRow>
}

type PastureShowMenuProps = {
    pastureId: string
    pastureName: string
    isShowMenuOpen: boolean
    setShowMenuOpen: (isShowMenuOpen: boolean) => void
    anchorEl?: HTMLButtonElement
}

const PastureShowMenu = ({ isShowMenuOpen, setShowMenuOpen, pastureName, pastureId, anchorEl }: PastureShowMenuProps) => {

    const { setPageProps } = useContext(PageContext)

    return <Menu
        anchorEl={anchorEl}
        open={isShowMenuOpen}
        onClose={() => setShowMenuOpen(false)}
    >
        <MenuList>
            <MenuItem>
                <Button
                    onClick={() => {
                        const page: PageProps = {
                            title: `Histórico de Entradas - ${pastureName}`,
                            page: <PastureEntriesPage {...{ pastureId }} />,
                            previousPages: [HomePage, FarmPage],
                        }
                        if (setPageProps) setPageProps(page)
                    }}
                >
                    Ver Histórico de Entradas
                </Button>
            </MenuItem>
            <MenuItem>
                <Button
                    onClick={() => {
                        const page: PageProps = {
                            title: `Rebanho - ${pastureName}`,
                            page: <PastureAnimalsPage {...{ pastureId }} />,
                            previousPages: [HomePage, FarmPage],
                        }
                        if (setPageProps) setPageProps(page)
                    }}
                >
                    Ver Rebanho no Pasto
                </Button>
            </MenuItem>
        </MenuList>
    </Menu>
}

const EditPastureRow = ({ rowValue, setRowValue, setEditing }: EditPastureRowProps) => {

    const { handleSubmit, control, setValue } = useForm({
        defaultValues: rowValue
    })

    const onSubmit = (data: PastureInfo) => {
        setRowValue(data)
        console.log(data)
        setEditing(false)
    }

    return <TableRow>
        <TableBodyCell>
            <EditingControlButtons setEditing={setEditing} onSave={handleSubmit(onSubmit)} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'pastureName'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                searchByInput={searchBull}
                searchById={searchBullById}
                onChange={(_, label) => setValue('bullName', label)}
                formProps={{
                    control,
                    name: 'bullId'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>{rowValue.animalsNumber}</TableBodyCell>
    </TableRow>
}
