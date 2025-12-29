import { AppRoute } from "@shared/main-page/PageDisplay";
import Home from "@mui/icons-material/Home"
import { AnimalsDashboard } from "@features/animals/AnimalsDashboard";

export const HomePage: AppRoute = {
    title: "Início",
    icon: <Home />,
    page: <AnimalsDashboard />
}
