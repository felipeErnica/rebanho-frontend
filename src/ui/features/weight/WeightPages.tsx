import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import Scale from "@mui/icons-material/Scale";
import { HomePage } from "../home/HomePage";
import { WeightDashboard } from "./WeightDashboard";
import { WeightEntriesTable } from "./WeightEntriesTable";

export const WeightMainPage: PageProps = {
    title: "Painel de Pesagem",
    crumbIcon: <Scale />,
    page: <WeightDashboard />,
    previousPages: [HomePage]
}

export const WeightEntriesPage: PageProps = {
    title: "Marcações de Peso",
    page: <WeightEntriesTable />,
    previousPages: [HomePage, WeightMainPage]
}
