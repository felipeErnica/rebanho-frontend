import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { EmbryoIcon } from "@shared/common/OtherIcons";
import { TransferDashboard } from "./TransferDashboard";
import { GroupsTablePage } from "./GroupTable";
import { GroupEntriesTablePage } from "./GroupEntriesTable";
import { EntriesTablePage } from "./EntriesTable";
import { useParams } from "react-router";
import { dateTransform } from "@/utils/Transformations";

const GroupEntriesTablePageWrapper = () => {
    const { transferDate } = useParams<{ transferDate: string }>();
    return <GroupEntriesTablePage transferDate={new Date(transferDate!)} />;
};

export const embryoTransferRoutes: AppRoute = {
    path: "embryo-transfer",
    element: <Outlet />,
    handle: {
        title: "Transferência Embrionária",
        icon: <EmbryoIcon />,
    },
    children: [
        {
            index: true,
            element: <TransferDashboard />,
        },
        {
            path: "entries",
            element: <EntriesTablePage />,
            handle: { title: "Histórico de Transferências" },
        },
        {
            path: "groups",
            element: <GroupsTablePage />,
            handle: { title: "Grupos de Transferência" },
        },
        {
            path: "groups/:transferDate",
            element: <GroupEntriesTablePageWrapper />,
            handle: {
                title: (params) => `Transferência - ${dateTransform(new Date(params.transferDate))}`,
            },
        },
    ],
};
