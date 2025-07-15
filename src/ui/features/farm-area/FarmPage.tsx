import { FarmMainIcon } from "@/ui/shared/common/OtherIcons";
import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "../home/HomePage";
import { FarmDashboard } from "./dashboard/FarmDashboard";

export const FarmPage: PageProps = {
    title: "Fazendas e Pastos",
    crumbIcon: <FarmMainIcon />,
    page: <FarmDashboard />,
    previousPages: [HomePage]
}

