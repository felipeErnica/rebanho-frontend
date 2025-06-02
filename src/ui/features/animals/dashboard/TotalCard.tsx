import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import { Button, CardActions } from "@mui/material"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

const TotalAnimalsTable = () => {
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
                <TableCell className="border-none">1500</TableCell>
                <TableCell className="border-none">750</TableCell>
                <TableCell className="border-none">750</TableCell>
            </TableRow>
        </TableBody>
    </Table>
}

export const TotalCard = () => {
    return <Card>
            <CardHeader title="Animais" />
            <CardContent>
                <TotalAnimalsTable />
            </CardContent>
            <CardActions>
                <Button 
                    size="small" 
                    endIcon={<ChevronRight />}
                >
                    Ver Mais
                </Button>
            </CardActions>
        </Card>
}
