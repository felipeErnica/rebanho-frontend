import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "@/ui/features/home/HomePage";
import { BullIcon } from "@/ui/shared/common/OtherIcons";
import { MatingDashboard } from "./NaturalMatingDashboard";
import { GroupsTablePage } from "./GroupsTable";

export const MatingMainPage: PageProps = {
    title: "Painel de Monta Natural",
    crumbIcon: <BullIcon />,
    page: <MatingDashboard />,
    previousPages: [HomePage]
}

export const GroupsTablePageProps: PageProps = {
    page: <GroupsTablePage />,
    title: 'Grupos de Monta',
    previousPages: [HomePage, MatingMainPage]
}

