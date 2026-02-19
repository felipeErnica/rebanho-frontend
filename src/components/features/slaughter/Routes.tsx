import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { SlaughterIcon } from "@shared/common/OtherIcons";
import { SlaughterDashboard } from "./SlaughterDashboard";
import { SlaughterEntriesTable } from "./SlaughterEntriesTable";
import { SlaughterGroupsTable } from "./SlaughterGroupsTable";
import { SlaughterGroupEntriesTable } from "./SlaughterGroupEntriesTable";
import { ButcherTable } from "../butchers/ButcherTable";
import { ButcherEntriesTable } from "../butchers/ButcherEntriesTable";
import { useParams } from "react-router";
import { dateTransform } from "@/utils/Transformations";

const SlaughterGroupEntriesTablePage = () => {
    const { entryDate } = useParams<{ entryDate: string }>();
    return <SlaughterGroupEntriesTable entryDate={new Date(entryDate!)} />;
};

const ButcherEntriesTablePage = () => {
    const { butcherId } = useParams<{ butcherId: string }>();
    return <ButcherEntriesTable butcherId={butcherId!} />;
};

export const slaughterRoutes: AppRoute = {
    path: "slaughter",
    element: <Outlet />,
    handle: {
        title: "Abate",
        icon: <SlaughterIcon />,
    },
    children: [
        {
            index: true,
            element: <SlaughterDashboard />,
        },
        {
            path: "entries",
            element: <SlaughterEntriesTable />,
            handle: { title: "Marcações de Abate" },
        },
        {
            path: "groups",
            element: <SlaughterGroupsTable />,
            handle: { title: "Abates" },
        },
        {
            path: "groups/:entryDate",
            element: <SlaughterGroupEntriesTablePage />,
            handle: {
                title: (params) => `Abate - ${dateTransform(new Date(params.entryDate))}`,
            },
        },
        {
            path: "butchers",
            element: <ButcherTable />,
            handle: { title: "Frigoríficos" },
        },
        {
            path: "butchers/:butcherId",
            element: <ButcherEntriesTablePage />,
            handle: { title: "Entradas do Frigorífico" },
        },
    ],
};
