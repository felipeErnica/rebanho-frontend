import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useEffect, useState } from "react"
import { TotalGeneral } from "../api/AnimalDashboard"
import { getTotalAnimals } from "../api/AnimalController"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import Collapse from "@mui/material/Collapse"
import { TableInfoAge } from "./TableInfoAge"

type TotalCardProps = {
    isTotalOpen: boolean
    setTotalOpen: (setTotalOpen: boolean) => void
}

const TotalAnimalsTable = () => {

    const [total, setTotal] = useState<TotalGeneral>({ totalAnimals: 0, totalFemales: 0, totalMales: 0 })

    useEffect(() => {
        getTotalAnimals({ isFiltered: false })
            .then(response => {
                const totals = response.json
                setTotal(totals)
            })
            .catch()
    }, [])

    return <Table>
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
}

export const TotalCard = ({isTotalOpen, setTotalOpen}: TotalCardProps) => {

    return <Card className="grow" variant="outlined">
            <CardHeader title="Animais" />
            <CardContent>
                <TotalAnimalsTable />
            </CardContent>
            <CardActions>
                <Button
                    onClick={() => setTotalOpen(!isTotalOpen)}
                    size="small"
                    endIcon={<ChevronRight className={`transition-transform duration-200 ${isTotalOpen ? 'rotate-90' : 'rotate-0'}`} />}
                >
                    Ver Mais
                </Button>
            </CardActions>
            <Collapse unmountOnExit in={isTotalOpen}>
                <TableInfoAge />
            </Collapse>
        </Card>
}
