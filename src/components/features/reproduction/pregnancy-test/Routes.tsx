import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { BirthTestIcon } from "@shared/common/OtherIcons";
import { BirthTestDashboard } from "./BirthTestDashboard";
import { EntriesTablePage } from "./EntriesTable";
import { GroupTablePage } from "./GroupTable";
import { GroupEntriesTablePage } from "./GroupEntriesTable";
import { useParams } from "react-router";
import { dateTransform } from "@/utils/Transformations";

const GroupEntriesTablePageWrapper = () => {
    const { testDate } = useParams<{ testDate: string }>();
    return <GroupEntriesTablePage testDate={new Date(testDate!)} />;
};

export const birthTestRoutes: AppRoute = {
    path: "birth-test",
    element: <Outlet />,
    handle: {
        title: "Exames de Toque",
        icon: <BirthTestIcon />,
    },
    children: [
        {
            index: true,
            element: <BirthTestDashboard />,
        },
        {
            path: "entries",
            element: <EntriesTablePage />,
            handle: { title: "Histórico de Toques" },
        },
        {
            path: "groups",
            element: <GroupTablePage />,
            handle: { title: "Exames de Toque" },
        },
        {
            path: "groups/:testDate",
            element: <GroupEntriesTablePageWrapper />,
            handle: {
                title: (params) => `Toque - ${dateTransform(new Date(params.testDate))}`,
            },
        },
    ],
};
