import { SlaughterIcon } from "@/ui/shared/common/OtherIcons";
import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { SlaughterDashboard } from "./SlaughterDashboard";
import { HomePage } from "../home/HomePage";
import { SlaughterEntriesTable } from "./SlaughterEntriesTable";

export const SlaughterMainPage: PageProps = {
    title: "Painel de Abate",
    crumbIcon: <SlaughterIcon />,
    page: <SlaughterDashboard />,
    previousPages: [HomePage]
}

export const SlaughterEntriesPage: PageProps = {
    title: "Marcações de Abate",
    page: <SlaughterEntriesTable />,
    previousPages: [HomePage, SlaughterMainPage]
}
