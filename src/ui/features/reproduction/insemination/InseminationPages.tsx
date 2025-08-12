import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { InseminationDasboard } from "./InseminationDashboard";
import { InseminationIcon } from "@/ui/shared/common/OtherIcons";
import { HomePage } from "@/ui/features/home/HomePage";
import { GroupsTablePage } from "./GroupsTable";

export const InseminationPage: PageProps = {
    title: "Painel de Inseminação",
    crumbIcon: <InseminationIcon />,
    page: <InseminationDasboard />,
    previousPages: [HomePage]
}

export const GroupsTablePageProps: PageProps = {
    page: <GroupsTablePage />,
    title: 'Grupos de Inseminação',
    previousPages: [HomePage, InseminationPage]
}

