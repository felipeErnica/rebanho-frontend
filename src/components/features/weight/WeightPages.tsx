import { PageProps } from "@shared/main-page/PageDisplay";
import Scale from "@mui/icons-material/Scale";
import { HomePage } from "@features/home/HomePage";
import { WeightDashboard } from "./WeightDashboard";
import { WeightEntriesTable } from "./WeightEntriesTable";
import { WeightGroupTable } from "./WeightGroupTable";

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

export const WeightGroupsPage: PageProps = {
    title: "Pesagens",
    page: <WeightGroupTable />,
    previousPages: [HomePage, WeightMainPage]
}
