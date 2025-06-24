import { CowHeadIcon } from "@/ui/shared/common/OtherIcons";
import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "@/ui/features/home/HomePage";
import { AnimalsDashboard } from "./dashboard/AnimalsDashboard";
import { AnimalsTable } from "./table/AnimalTable";

export const AnimalDashboardPage: PageProps = {
    title: "Animais",
    crumbIcon: <CowHeadIcon />,
    page: <AnimalsDashboard />,
    previousPages: [HomePage]
}

export const AnimalTablePage: PageProps = {
    title: "Histórico de Rebanho",
    page: <AnimalsTable />,
    previousPages: [HomePage, AnimalDashboardPage]
}
