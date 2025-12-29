import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { BullIcon } from "@shared/common/OtherIcons";
import { BreedingDashboard } from "./BreedingDashboard";
import { GroupsTablePage } from "./GroupsTable";
import { GroupEntriesTablePage } from "./GroupEntriesTable";
import { EntriesTablePage } from "./EntriesTable";
import { useParams } from "react-router";
import { dateTransform } from "@/utils/Transformations";

const GroupEntriesTablePageWrapper = () => {
    const { breedingDate } = useParams<{ breedingDate: string }>();
    return <GroupEntriesTablePage breedingDate={new Date(breedingDate!)} />;
};

export const breedingRoutes: AppRoute = {
    path: "mating",
    element: <Outlet />,
    handle: {
        title: "Cobertura",
        icon: <BullIcon />,
    },
    children: [
        {
            index: true,
            element: <BreedingDashboard />,
        },
        {
            path: "entries",
            element: <EntriesTablePage />,
            handle: { title: "Histórico de Coberturas" },
        },
        {
            path: "groups",
            element: <GroupsTablePage />,
            handle: { title: "Datas de Cobertura" },
        },
        {
            path: "groups/:breedingDate",
            element: <GroupEntriesTablePageWrapper />,
            handle: {
                title: (params) => `Cobertura - ${dateTransform(new Date(params.breedingDate))}`,
            },
        },
    ],
};
