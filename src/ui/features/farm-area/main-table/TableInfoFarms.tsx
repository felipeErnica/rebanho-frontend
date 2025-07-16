import { Collapse, IconButton, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { FarmInfo, PastureInfo } from "./api/entities"
import { getFarmsInfo, getPasturesInfo, searchBull } from "./api/DashboardController"
import ChevronRight from "@mui/icons-material/ChevronRight"
import EditIcon from '@mui/icons-material/Edit';
import { useForm } from "react-hook-form"
import Check from "@mui/icons-material/Check"
import Close from "@mui/icons-material/Close"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import Delete from "@mui/icons-material/Delete"
import { ShowControlButton } from "@/ui/shared/table/ControlButtons"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { HomePage } from "../../home/HomePage"
import { FarmPage } from "../FarmPage"
import { FarmAnimalsTable } from "../farm-animals/FarmAnimalsTable"
import { PageContext } from "@/ui/shared/main-page/PageContext"

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
                <TableRow className="bg-gray-700">
                    <TableCell className="text-white" colSpan={2}>Fazenda</TableCell>
                    <TableCell className="text-white">Número de Pastagens</TableCell>
                    <TableCell className="text-white">Número de Animais</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading &&
                    <TableCell colSpan={4}>
                        <Skeleton animation='pulse' variant="rectangular" />
                    </TableCell>
                }
                {rows.map(row => <InfoFarmsRow {...row} />)}
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
        <TableRow>
            <TableCell className="text-nowrap">
                <div className="flex flex-row gap-2 max-w-fit">
                    <IconButton onClick={() => setOpen(!isOpen)}>
                        <ChevronRight className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                    </IconButton>
                    <IconButton onClick={() => setEditing(true)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => console.log("delete: ", farmName)}>
                        <Delete />
                    </IconButton>
                    <ShowControlButton 
                        onShow={() => {
                            const nextPage: PageProps = {
                                title: `Rebanho - ${farmName}`,
                                page: <FarmAnimalsTable {...{farmId }}/>,
                                previousPages: [HomePage, FarmPage]
                            } 
                            if (setPageProps) setPageProps(nextPage)
                        }}
                    />
                </div>
            </TableCell>
            <TableCell> {farmName} </TableCell>
            <TableCell> {pasturesNumber} </TableCell>
            <TableCell> {animalsNumber} </TableCell>
        </TableRow>
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
        <TableCell className="max-w-fit">
            <div className="flex flex-row gap-2">
                <IconButton onClick={handleSubmit(onSubmit)}>
                    <Check />
                </IconButton>
                <IconButton onClick={() => setEditing(false)}>
                    <Close />
                </IconButton>
            </div>
        </TableCell>
        <TableCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'farmName'
                }}
            />
        </TableCell>
        <TableCell> {rowValue.pasturesNumber} </TableCell>
        <TableCell> {rowValue.animalsNumber} </TableCell>
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

    return <Table>
        <TableHead>
            <TableRow>
                <TableCell colSpan={2} className="bg-gray-700 text-white">Pasto</TableCell>
                <TableCell className="bg-gray-700 text-white">Touro</TableCell>
                <TableCell className="bg-gray-700 text-white">Número de Animais</TableCell>
            </TableRow>
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

const NormalPastureRow = ({ rowValue: { pastureName, bullName, animalsNumber }, setEditing }: PastureRowProps) => {
    return <TableRow>
        <TableCell>
            <IconButton onClick={() => setEditing(true)}>
                <EditIcon />
            </IconButton>
            <IconButton onClick={() => console.log("delete: ", pastureName)}>
                <Delete />
            </IconButton>
        </TableCell>
        <TableCell>{pastureName}</TableCell>
        <TableCell>{bullName || 'SEM TOURO'}</TableCell>
        <TableCell>{animalsNumber}</TableCell>
    </TableRow>
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
        <TableCell>
            <div className="flex flex-row gap-2">
                <IconButton onClick={handleSubmit(onSubmit)} >
                    <Check />
                </IconButton>
                <IconButton onClick={() => setEditing(false)} >
                    <Close />
                </IconButton>
            </div>
        </TableCell>
        <TableCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'pastureName'
                }}
            />
        </TableCell>
        <TableCell>
            <FormSearchBox
                fetchOptions={searchBull}
                onChange={(_, label) => setValue('bullName', label)}
                valueLabel={rowValue.bullName}
                formProps={{
                    control,
                    name: 'bullId'
                }}
            />
        </TableCell>
        <TableCell>{rowValue.animalsNumber}</TableCell>
    </TableRow>
}
