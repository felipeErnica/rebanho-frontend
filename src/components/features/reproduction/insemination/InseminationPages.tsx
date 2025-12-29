import { AppRoute } from "@shared/main-page/PageDisplay";
import { InseminationDasboard } from "./InseminationDashboard";
import { InseminationIcon } from "@shared/common/OtherIcons";
import { HomePage } from "@features/home/HomePage";
import { GroupsTablePage } from "./GroupsTable";

export const InseminationPage: AppRoute = {
    title: "Painel de Inseminação",
    icon: <InseminationIcon />,
    page: <InseminationDasboard />,
    previousPages: [HomePage]
}

export const GroupsTablePageProps: AppRoute = {
    page: <GroupsTablePage />,
    title: 'Grupos de Inseminação',
    previousPages: [HomePage, InseminationPage]
}

