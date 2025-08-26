import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "@/ui/features/home/HomePage";
import { LactationDashboard } from "./LactarionDashboard";
import { LactationIcon } from "@/ui/shared/common/OtherIcons";

export const MilkDashboardPage: PageProps = {
    title: "Painel de Lactação",
    crumbIcon: <LactationIcon />,
    page: <LactationDashboard />, 
    previousPages: [HomePage]
}
