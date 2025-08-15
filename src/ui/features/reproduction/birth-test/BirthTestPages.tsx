import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "@/ui/features/home/HomePage";
import { BirthTestIcon } from "@/ui/shared/common/OtherIcons";
import { BirthTestDashboard } from "./BirthTestDashboard";

export const BirthTestTablePage: PageProps = {
    title: "Painel de Toque",
    crumbIcon: <BirthTestIcon />,
    page: <BirthTestDashboard />,
    previousPages: [HomePage]
}
