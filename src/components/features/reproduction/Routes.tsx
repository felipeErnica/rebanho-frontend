import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { inseminationRoutes } from "./insemination/Routes";
import { embryoTransferRoutes } from "./embryo-transfer/Routes";
import { breedingRoutes } from "./breeding/Routes";

export const reproductionRoutes: AppRoute = {
    path: "reproduction",
    element: <Outlet />,
    children: [
        inseminationRoutes,
        breedingRoutes,
        embryoTransferRoutes,
    ],
} 
