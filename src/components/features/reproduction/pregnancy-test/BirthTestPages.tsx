import { AppRoute } from "@shared/main-page/PageDisplay";
import { HomePage } from "@features/home/HomePage";
import { BirthTestIcon } from "@shared/common/OtherIcons";
import { BirthTestDashboard } from "./BirthTestDashboard";
import { EntriesTablePage } from "./EntriesTable";
import { GroupTablePage } from "./GroupTable";

export const BirthTestDashboardPage: AppRoute = {
    title: "Painel de Toque",
    icon: <BirthTestIcon />,
    page: <BirthTestDashboard />,
    previousPages: [HomePage]
}

export const BirthTestEntriesPage: AppRoute = {
    title: "Histórico de Toques",
    page: <EntriesTablePage />,
    previousPages: [HomePage, BirthTestDashboardPage]
}

export const BirthTestGroupPage: AppRoute = {
    title: "Exames de Toque",
    page: <GroupTablePage />,
    previousPages: [HomePage, BirthTestDashboardPage]
}
