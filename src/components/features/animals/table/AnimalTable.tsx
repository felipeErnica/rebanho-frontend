import { useState } from "react";
import { AnimalFilter } from "@features/animals/table/api/AnimalInfo";
import { ComboBoxItem } from "@shared/common/ComboBox";
import { TableDisplay } from "@shared/display/Display";
import { useTableAnimals } from "./TableModel";
import { AnimalFilterElement } from "./AnimalFilter";
import { Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { AddAnimalDialog } from "../add-animal/AddAnimalDialog";

export const AnimalsTable = () => {

    const [filter, setFilter] = useState<AnimalFilter>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('animal_order')
    const [isAddOpen, setAddOpen] = useState(false)

    const filterPanel = <AnimalFilterElement {...{ filter, setFilter }} />
    const tableProps = useTableAnimals({ filter, sort, order })
    const otherButtons = (
        <Button
            variant="outlined"
            onClick={() => setAddOpen(true)}
            startIcon={<Add />}
        >
            Adicionar Animal
        </Button>
    )

    const sortableColumns: ComboBoxItem[] = [
        { name: "Nome", value: "name" },
        { name: "Data de Morte", value: "death_date" },
        { name: "Data de Nascimento", value: "birth_date" },
        { name: "Data de Desmame", value: "weaning_date" },
        { name: "Brinco", value: "animal_order" },
        { name: "I.S.R.", value: "isr" },
        { name: "Média de Produção", value: "average_prod" },
        { name: "Intervalo de Produção Médio", value: "average_prod_interval" },
        { name: "Intervalo de Parição Médio", value: "average_birth_interval" },
    ]

    return <>
        <TableDisplay {...{
            sort,
            setSort,
            order,
            setOrder,
            tableProps,
            sortableColumns,
            filterPanel,
            setFilter,
            otherButtons,
        }} />
        <AddAnimalDialog {...{ isAddOpen, setAddOpen }} />
    </>
}
