import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import Home from "@mui/icons-material/Home"
import { HomeDashboard } from "./HomeDash";

export const HomePage: PageProps = {
    title: "Início",
    crumbIcon: <Home />,
    page: <HomeDashboard />
}
