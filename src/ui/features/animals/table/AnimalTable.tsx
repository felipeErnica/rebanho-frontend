import { useState } from "react";
import { AnimalFilter } from "@/ui/features/animals/table/api/AnimalInfo";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { TableDisplay } from "@/ui/shared/display/Display";
import { useTableAnimals as buildAnimalsTable } from "./TableModel";
import { AnimalFilterElement } from "./AnimalFilter";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import Add from "@mui/icons-material/Add";

export const AnimalsTable = () => {

    const [filter, setFilter] = useState<AnimalFilter>({ isFiltered: false })
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('animal_order')

    const filterPanel = <AnimalFilterElement {...{ filter, setFilter }} />
    const tableProps = buildAnimalsTable({ filter, sort, order })
    const otherActions = (
        <>
            <MenuItem>
                <ListItemIcon>
                    <Add fontSize="small" />
                </ListItemIcon>
                <ListItemText> Adicionar Animal </ListItemText>
            </MenuItem>
        </>
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

    return <TableDisplay {...{
        sort,
        setSort,
        order,
        setOrder,
        tableProps,
        sortableColumns,
        filterPanel,
        setFilter,
        otherActions
    }} />
}
