import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { TableDisplay } from "@/ui/shared/display/Display";
import { IFilters } from "@/shared/interfaces/Filter";
import { buildSlaughterTable } from "./TableModel";
import { SlaughterFilter } from "./SlaughterFilter";
import { useFilterForm } from "@/ui/shared/common/FilterUtil";

export const SlaughterTable = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false });
    const [order, setOrder] = useState("asc");
    const [sort, setSort] = useState("value");

    const tableProps = buildSlaughterTable({ filter, sort, order });

    const { handleSubmit, control } = useFilterForm<IFilters>();
    const filterPanel = <SlaughterFilter {...{ control }} />;

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "animalNumber" },
        { name: "Nome da Vaca", value: "animalName" },
        { name: "Data de Nascimento", value: "lossDate" },
        { name: "Data de Abate", value: "slaughterDate" },
        { name: "Última Pesagem", value: "weight" },
        { name: "Peso Morto", value: "deadWeight" },
    ];

    return (
        <TableDisplay
            order={order}
            setOrder={setOrder}
            sort={sort}
            setSort={setSort}
            filterPanel={filterPanel}
            sortableColumns={sortableColumns}
            tableProps={tableProps}
            handleSubmit={handleSubmit}
            setFilter={setFilter}
        />
    );
};

