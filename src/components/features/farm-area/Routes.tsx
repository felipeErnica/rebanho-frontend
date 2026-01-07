import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { FarmMainIcon } from "@shared/common/OtherIcons";
import { PastureDashboard } from "./PastureDashboard";

export const farmAreaRoutes: AppRoute = {
    path: "farm-pastures",
    element: <Outlet />,
    handle: {
        title: "Fazendas e Pastos",
        icon: <FarmMainIcon />,
    },
    children: [
        {
            index: true,
            element: <PastureDashboard />
        }
    ]
};
