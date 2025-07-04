import { useState } from "react";
import { TableDisplay } from "@/ui/shared/display/Display";
import { buildMatingTable } from "./TableModel";
import { MatingFilter } from "./MatingFilter";
import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { useFilterForm } from "@/ui/shared/common/FilterUtil";
import { IFilters } from "@/shared/interfaces/Filter";

export const NaturalMatingTable = () => {
    const [filter, setFilter] = useState<IFilters>({ isFiltered: false });
    const [order, setOrder] = useState("number");
    const [sort, setSort] = useState("asc");

    const tableModel = buildMatingTable({ filter, sort, order });

    const { handleSubmit, control } = useFilterForm<IFilters>();
    const filterPanel = <MatingFilter {...{ control }} />;

    const sortableColumns: ComboBoxItem[] = [
        { name: "Brinco", value: "animalNumber" },
        { name: "Nome da Vaca", value: "animalName" },
        { name: "Data de Monta", value: "matingDate" },
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

