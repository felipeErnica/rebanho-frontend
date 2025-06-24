import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import { useContext, useEffect, useState } from "react"
import { AnimalDashboardFilter, TotalGeneral } from "./api/DashboardEntities"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import Add from "@mui/icons-material/Add"
import Refresh from "@mui/icons-material/Refresh"
import NavigateNext from "@mui/icons-material/NavigateNext"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Table from "@mui/material/Table"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import Collapse from "@mui/material/Collapse"
import { TableInfoAge } from "./TableInfoAge"
import { AddAnimalDialog } from "../add-animal/AddAnimalDialog"
import { getTotalAnimals } from "./api/DashboardController"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { AnimalTablePage } from "../AnimalsPage"

type AnimalsInfoTableProps = {
    filter: AnimalDashboardFilter
    setFilter: (filter: AnimalDashboardFilter) => void
}

export const AnimalsInfoTable = ({ filter, setFilter }: AnimalsInfoTableProps) => {

    const [total, setTotal] = useState<TotalGeneral>({ totalAnimals: 0, totalFemales: 0, totalMales: 0 })
    const [isOpen, setOpen] = useState(false)
    const [isAddOpen, setAddOpen] = useState(false)
    const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        const tableFilter: AnimalDashboardFilter = {
            ...filter,
            farmId: undefined,
            pastureId: undefined
        }
        getTotalAnimals(tableFilter)
            .then(response => {
                const totals = response.json
                setTotal(totals)
            })
            .catch()
    }, [filter])

    return <Card variant="outlined" className="col-span-3">
        <CardHeader
            title="Informações Gerais"
            action={
                <Button
                    startIcon={<Refresh />}
                    onClick={() => setFilter({ isFiltered: false })}
                >
                    Recarregar Informações
                </Button>
            }
        />
        <CardContent>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell className="border-none">Total de Animais</TableCell>
                        <TableCell className="border-none">Total de Machos</TableCell>
                        <TableCell className="border-none">Total de Fêmeas</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell className="border-none">{total.totalAnimals}</TableCell>
                        <TableCell className="border-none">{total.totalMales}</TableCell>
                        <TableCell className="border-none">{total.totalFemales}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <AddAnimalDialog {...{ isAddOpen, setAddOpen }} />
        </CardContent>
        <CardActions disableSpacing>
            <Button
                endIcon={<ExpandMoreIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />}
                onClick={() => setOpen(!isOpen)}
            >
                {!isOpen ? 'Ver Mais' : 'Recolher Tabela'}
            </Button>
            <Button
                className="ml-auto"
                startIcon={<Add />}
                onClick={() => setAddOpen(true)}
            >
                Adicionar Animal
            </Button>
            <Button
                onClick={() => setPageProps && setPageProps(AnimalTablePage)}
                startIcon={<NavigateNext />}
            >
                Ver Tabela de Rebanho
            </Button>
        </CardActions>
        <Collapse in={isOpen} unmountOnExit>
            <TableInfoAge {...{ filter, setFilter }} />
        </Collapse>
    </Card>
}
