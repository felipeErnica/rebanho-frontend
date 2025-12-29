import { AppRoute } from "@shared/main-page/PageDisplay";
import { HomePage } from "@features/home/HomePage";
import { BullIcon } from "@shared/common/OtherIcons";
import { BreedingDashboard } from "./BreedingDashboard";
import { GroupsTablePage } from "./GroupsTable";

export const BreedingMainPage: AppRoute = {
    title: "Painel de Coberturas",
    icon: <BullIcon />,
    page: <BreedingDashboard />,
    previousPages: [HomePage]
}

export const GroupsTablePageProps: AppRoute = {
    page: <GroupsTablePage />,
    title: 'Datas de Cobertura',
    previousPages: [HomePage, BreedingMainPage]
}

