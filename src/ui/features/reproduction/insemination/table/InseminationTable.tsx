import { useState } from "react";
import { TableDisplay } from "@/ui/shared/display/Display";
import { buildInseminationTable } from "./TableModel";
import { InseminationFilter } from "./InseminationFilter";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { IFilters } from "@/shared/interfaces/Filter";
import { useFilterForm } from "@/ui/shared/common/FilterUtil";

export const InseminationTable = () => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false });
    const [order, setOrder] = useState("number");
    const [sort, setSort] = useState("asc");

    const tableModel = buildInseminationTable({ filter, sort, order });

    const { handleSubmit, control } = useFilterForm<IFilters>();
    const filterPanel = <InseminationFilter {...{ control }} />;

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "animalNumber" },
        { name: "Nome da Vaca", value: "animalName" },
        { name: "Data de Inseminação", value: "groupDate" },
        { name: "Touro", value: "bullName" },
        { name: "Status", value: "status" },
        { name: "Observações", value: "observation" },
    ];

    return (
        <TableDisplay
            filterPanel={filterPanel}
            tableProps={tableModel}
            setOrder={setOrder}
            setSort={setSort}
            sortableColumns={sortableColumns}
            sort={sort}
            order={order}
            handleSubmit={handleSubmit}
            setFilter={setFilter}
        />
    );
};

