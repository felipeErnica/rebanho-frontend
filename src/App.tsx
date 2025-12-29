import { createHashRouter, RouterProvider } from "react-router"
import { routes } from "./Routes"

export const App = () => {
    const router = createHashRouter(routes)
    return <RouterProvider router={router} />
}
