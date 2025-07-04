import { JSX, useState } from "react";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { TableDisplay } from "@/ui/shared/display/Display";
import { IFilters } from "@/shared/interfaces/Filter";
import { buildLossTable } from "./TableModel";
import { LossFilter } from "./LossFilter";
import { useFilterForm } from "@/ui/shared/common/FilterUtil";

export const LossTable = (): JSX.Element => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false });
    const [order, setOrder] = useState("asc");
    const [sort, setSort] = useState("name");

    const tableProps = buildLossTable({ filter, sort, order });

    const { handleSubmit, control } = useFilterForm<IFilters>();
    const filterPanel = <LossFilter {...{ control }} />;

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "animalNumber" },
        { name: "Nome da Vaca", value: "animalName" },
        { name: "Data de Toque", value: "groupDate" },
        { name: "Data Prevista de Parto", value: "birthForecast" },
        { name: "Observações", value: "observation" },
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

