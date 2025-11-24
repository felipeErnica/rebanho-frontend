import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "@/ui/features/home/HomePage";
import { BullIcon } from "@/ui/shared/common/OtherIcons";
import { BreedingDashboard } from "./BreedingDashboard";
import { GroupsTablePage } from "./GroupsTable";

export const BreedingMainPage: PageProps = {
    title: "Painel de Coberturas",
    crumbIcon: <BullIcon />,
    page: <BreedingDashboard />,
    previousPages: [HomePage]
}

export const GroupsTablePageProps: PageProps = {
    page: <GroupsTablePage />,
    title: 'Datas de Cobertura',
    previousPages: [HomePage, BreedingMainPage]
}

