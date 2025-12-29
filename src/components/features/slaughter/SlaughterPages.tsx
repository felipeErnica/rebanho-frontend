import { SlaughterIcon } from "@shared/common/OtherIcons";
import { AppRoute } from "@shared/main-page/PageDisplay";
import { SlaughterDashboard } from "./SlaughterDashboard";
import { HomePage } from "../home/HomePage";
import { SlaughterEntriesTable } from "./SlaughterEntriesTable";
import { SlaughterGroupsTable } from "./SlaughterGroupsTable";
import { ButcherTable } from "./ButcherTable";

export const SlaughterMainPage: AppRoute = {
    title: "Painel de Abate",
    icon: <SlaughterIcon />,
    page: <SlaughterDashboard />,
    previousPages: [HomePage]
}

export const SlaughterEntriesPage: AppRoute = {
    title: "Marcações de Abate",
    page: <SlaughterEntriesTable />,
    previousPages: [HomePage, SlaughterMainPage]
}

export const SlaughterGroupsPage: AppRoute = {
    title: "Abates",
    page: <SlaughterGroupsTable />,
    previousPages: [HomePage, SlaughterMainPage]
}

export const ButcherPage: AppRoute = {
    title: "Frigoríficos",
    page: <ButcherTable />,
    previousPages: [HomePage, SlaughterMainPage]
}
