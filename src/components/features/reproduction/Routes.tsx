import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { birthRoutes } from "./births/Routes";
import { birthTestRoutes } from "./pregnancy-test/Routes";
import { inseminationRoutes } from "./insemination/Routes";
import { breedingRoutes } from "./breeding/Routes";
import { embryoTransferRoutes } from "./embryo-transfer/Routes";

export const reproductionRoutes: AppRoute = {
    path: "reproduction",
    element: <Outlet />,
    children: [
        birthRoutes,
        birthTestRoutes,
        inseminationRoutes,
        breedingRoutes,
        embryoTransferRoutes,
    ],
} 
