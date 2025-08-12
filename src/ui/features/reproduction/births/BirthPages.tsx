import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "../../home/HomePage";
import { BirthDashboard } from "./BirthDashboard";
import { CalfIcon } from "@/ui/shared/common/OtherIcons";

export const BirthPage: PageProps = {
    title: "Parições",
    crumbIcon: <CalfIcon />,
    page: <BirthDashboard />,
    previousPages: [HomePage]
}
