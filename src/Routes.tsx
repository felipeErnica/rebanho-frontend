import { ReactNode } from "react"
import { RouteObject } from "react-router"
import { LoginDisplay } from "./components/features/auth/LoginDisplay"
import { PageDisplay } from "./components/shared/main-page/PageDisplay"
import { lactationRoutes } from "./components/features/lactation/Routes"
import { reproductionRoutes } from "./components/features/reproduction/Routes"
import { homeRoutes } from "./components/features/home/Routes"
import { farmAreaRoutes } from "./components/features/farm-area/Routes"
import { weightRoutes } from "./components/features/weight/Routes"
import { slaughterRoutes } from "./components/features/slaughter/Routes"

export type RouteHandle = {
    title: string | ((params: Record<string, string>, data?: any) => string)
    icon?: ReactNode
}

export type AppRoute = RouteObject & {
    children?: AppRoute[]
    handle?: RouteHandle
}

export const routes: AppRoute[] = [
    {
        index: true,
        element: <LoginDisplay />,
        handle: {
            title: 'Login',
        },
    },
    {
        path: '/home',
        element: <PageDisplay />,
        errorElement: <PageDisplay />,
        children: [
            homeRoutes,
            farmAreaRoutes,
            reproductionRoutes,
            lactationRoutes,
            weightRoutes,
            slaughterRoutes,
        ]
    }
]
