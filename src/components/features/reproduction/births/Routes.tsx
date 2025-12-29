import { BirthDashboard } from "./BirthDashboard";
import { CalfIcon } from "@shared/common/OtherIcons";
import { AppRoute } from "@/Routes";
import { BirthTablePage } from "./BirthTable";
import { Outlet } from "react-router";

export const birthRoutes: AppRoute = {
    path: "births",
    element: <Outlet />,
    handle: {
        title: "Parições",
        icon: <CalfIcon />,
    },
    children: [
        {
            index: true,
            element: <BirthDashboard />,
        },
        {
            path: 'entries',
            element: <BirthTablePage />,
            handle: { title: 'Tabela de Parição' }
        }
    ]
}
