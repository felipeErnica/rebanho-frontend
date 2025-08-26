import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "../../home/HomePage";
import { LossDashboard } from "./LossDashboard";
import { LossTablePage } from "./LossTable";
import { PregnancyLossIcon } from "@/ui/shared/common/OtherIcons";

export const LossDashboardPage: PageProps = {
    title: "Painel de Perdas",
    crumbIcon: <PregnancyLossIcon />,
    page: <LossDashboard />,
    previousPages: [HomePage]
}

export const LossTablePageProps: PageProps = {
    title: "Histórico de Perdas",
    page: <LossTablePage />,
    previousPages: [HomePage, LossDashboardPage]
}
