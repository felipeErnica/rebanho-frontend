import { AppRoute } from "@shared/main-page/PageDisplay";
import { HomePage } from "@features/home/HomePage";
import { EmbryoIcon } from "@shared/common/OtherIcons";
import { GroupsTablePage } from "./GroupTable";
import { TransferDashboard } from "./TransferDashboard";

export const TransferMainPage: AppRoute = {
    title: "Painel de Transferência de Embrião",
    icon: <EmbryoIcon />,
    page: <TransferDashboard />,
    previousPages: [HomePage]
}

export const GroupsTablePageProps: AppRoute = {
    page: <GroupsTablePage />,
    title: 'Grupos de Transferência',
    previousPages: [HomePage, TransferMainPage]
}

