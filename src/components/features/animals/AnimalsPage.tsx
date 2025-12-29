import { CowHeadIcon } from "@shared/common/OtherIcons";
import { AppRoute } from "@shared/main-page/PageDisplay";
import { HomePage } from "@features/home/HomePage";
import { AnimalsDashboard } from "./AnimalsDashboard";

export const AnimalDashboardPage: AppRoute = {
    title: "Animais",
    icon: <CowHeadIcon />,
    page: <AnimalsDashboard />,
    previousPages: [HomePage]
}

export const AnimalTablePage: AppRoute = {
    title: "Histórico de Rebanho",
    page: <div />,
    previousPages: [HomePage, AnimalDashboardPage]
}
