import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { birthRoutes } from "./births/Routes";

export const reproductionRoutes: AppRoute[] = [
    {
        path: "reproduction",
        element: <Outlet />,
        children: [
            birthRoutes,
        ]
    }
] 
