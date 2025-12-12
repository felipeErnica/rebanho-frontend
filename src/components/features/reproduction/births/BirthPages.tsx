import { PageProps } from "@shared/main-page/PageDisplay";
import { HomePage } from "@features/home/HomePage";
import { BirthDashboard } from "./BirthDashboard";
import { CalfIcon } from "@shared/common/OtherIcons";

export const BirthPage: PageProps = {
    title: "Parições",
    crumbIcon: <CalfIcon />,
    page: <BirthDashboard />,
    previousPages: [HomePage]
}
