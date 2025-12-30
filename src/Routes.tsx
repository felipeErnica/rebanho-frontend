import { ReactNode } from "react"
import { isRouteErrorResponse, RouteObject, useRouteError } from "react-router"
import { LoginDisplay } from "./components/features/auth/LoginDisplay"
import { PageDisplay } from "./components/shared/main-page/PageDisplay"
import { lactationRoutes } from "./components/features/lactation/Routes"
import { reproductionRoutes } from "./components/features/reproduction/Routes"
import { farmAreaRoutes } from "./components/features/farm-area/Routes"
import { weightRoutes } from "./components/features/weight/Routes"
import { slaughterRoutes } from "./components/features/slaughter/Routes"
import { animalRoutes } from "./components/features/animals/Routes"
import Home from "@mui/icons-material/Home"

export type RouteHandle = {
    title: string | ((params: Record<string, string>, data?: any) => string)
    icon?: ReactNode
}

export type AppRoute = RouteObject & {
    children?: AppRoute[]
    handle?: RouteHandle
}


const BoundaryError = () => {
    const error = useRouteError(); // Hook to access the error

    // Use isRouteErrorResponse for specific HTTP errors (e.g., 404, 403)
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>{error.status} {error.statusText}</h1>
                <p>{error.data}</p>
            </div>
        );
    }

    // Handle generic Errors
    return <div>Oopss! Ocorreu um erro.</div>;
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
        path: '/main',
        element: <PageDisplay />,
        errorElement: <BoundaryError />,
        handle: {
            title: "Início",
            icon: <Home />,
        },
        children: [
            ...animalRoutes,
            farmAreaRoutes,
            reproductionRoutes,
            lactationRoutes,
            weightRoutes,
            slaughterRoutes,
        ]
    }
]
