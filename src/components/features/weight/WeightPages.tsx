import { AppRoute } from "@shared/main-page/PageDisplay";
import Scale from "@mui/icons-material/Scale";
import { HomePage } from "@features/home/HomePage";
import { WeightDashboard } from "./WeightDashboard";
import { WeightEntriesTable } from "./WeightEntriesTable";
import { WeightGroupTable } from "./WeightGroupTable";

export const WeightMainPage: AppRoute = {
    title: "Painel de Pesagem",
    icon: <Scale />,
    page: <WeightDashboard />,
    previousPages: [HomePage]
}

export const WeightEntriesPage: AppRoute = {
    title: "Marcações de Peso",
    page: <WeightEntriesTable />,
    previousPages: [HomePage, WeightMainPage]
}

export const WeightGroupsPage: AppRoute = {
    title: "Pesagens",
    page: <WeightGroupTable />,
    previousPages: [HomePage, WeightMainPage]
}
