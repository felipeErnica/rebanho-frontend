import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "@/ui/features/home/HomePage";
import { BirthTestIcon } from "@/ui/shared/common/OtherIcons";
import { BirthTestDashboard } from "./BirthTestDashboard";
import { EntriesTablePage } from "./EntriesTable";
import { GroupTablePage } from "./GroupTable";

export const BirthTestDashboardPage: PageProps = {
    title: "Painel de Toque",
    crumbIcon: <BirthTestIcon />,
    page: <BirthTestDashboard />,
    previousPages: [HomePage]
}

export const BirthTestEntriesPage: PageProps = {
    title: "Histórico de Toques",
    page: <EntriesTablePage />,
    previousPages: [HomePage, BirthTestDashboardPage]
}

export const BirthTestGroupPage: PageProps = {
    title: "Exames de Toque",
    page: <GroupTablePage />,
    previousPages: [HomePage, BirthTestDashboardPage]
}
