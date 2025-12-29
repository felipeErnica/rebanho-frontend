import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { InseminationIcon } from "@shared/common/OtherIcons";
import { InseminationDasboard } from "./InseminationDashboard";
import { GroupsTablePage } from "./GroupsTable";
import { GroupEntriesTablePage } from "./GroupEntriesTable";
import { EntriesTablePage } from "./EntriesTable";
import { useParams } from "react-router";
import { dateTransform } from "@/utils/Transformations";

const GroupEntriesTablePageWrapper = () => {
    const { inseminationDate } = useParams<{ inseminationDate: string }>();
    return <GroupEntriesTablePage inseminationDate={new Date(inseminationDate!)} />;
};

export const inseminationRoutes: AppRoute = {
    path: "insemination",
    element: <Outlet />,
    handle: {
        title: "Inseminação",
        icon: <InseminationIcon />,
    },
    children: [
        {
            index: true,
            element: <InseminationDasboard />,
        },
        {
            path: "entries",
            element: <EntriesTablePage />,
            handle: { title: "Histórico de Inseminações" },
        },
        {
            path: "groups",
            element: <GroupsTablePage />,
            handle: { title: "Grupos de Inseminação" },
        },
        {
            path: "groups/:inseminationDate",
            element: <GroupEntriesTablePageWrapper />,
            handle: {
                title: (params) => `Inseminação - ${dateTransform(new Date(params.inseminationDate))}`,
            },
        },
    ],
};
