import { AppRoute } from "@/Routes";
import Home from "@mui/icons-material/Home";
import { AnimalsDashboard } from "../animals/AnimalsDashboard";

export const homeRoutes: AppRoute = {
    index: true,
    element: <AnimalsDashboard />,
    handle: {
        title: "Início",
        icon: <Home />,
    },
}
