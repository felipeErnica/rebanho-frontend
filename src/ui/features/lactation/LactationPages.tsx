import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "@/ui/features/home/HomePage";
import { LactationDashboard } from "./LactarionDashboard";
import { LactationIcon } from "@/ui/shared/common/OtherIcons";
import { MilkEntriesTablePage } from "./MilkEntriesTable";
import { GroupTablePage } from "./MilkGroupTable";

export const MilkDashboardPage: PageProps = {
    title: "Painel de Lactação",
    crumbIcon: <LactationIcon />,
    page: <LactationDashboard />, 
    previousPages: [HomePage]
}

export const MilkEntriesPage: PageProps = {
    title: "Histórico de Marcações",
    page: <MilkEntriesTablePage />, 
    previousPages: [HomePage, MilkDashboardPage]
}

export const MilkGroupsPage: PageProps = {
    title: "Dias de Marcação",
    page: <GroupTablePage />, 
    previousPages: [HomePage, MilkDashboardPage]
}
