import { CowHeadIcon } from "@shared/common/OtherIcons";
import { PageProps } from "@shared/main-page/PageDisplay";
import { HomePage } from "@features/home/HomePage";
import { AnimalsDashboard } from "./AnimalsDashboard";

export const AnimalDashboardPage: PageProps = {
    title: "Animais",
    crumbIcon: <CowHeadIcon />,
    page: <AnimalsDashboard />,
    previousPages: [HomePage]
}

export const AnimalTablePage: PageProps = {
    title: "Histórico de Rebanho",
    page: <div />,
    previousPages: [HomePage, AnimalDashboardPage]
}
