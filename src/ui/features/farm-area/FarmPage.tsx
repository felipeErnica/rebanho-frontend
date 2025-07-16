import { FarmMainIcon } from "@/ui/shared/common/OtherIcons";
import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "../home/HomePage";
import { FarmTableArea } from "./main-table/FarmTableArea";

export const FarmPage: PageProps = {
    title: "Fazendas e Pastos",
    crumbIcon: <FarmMainIcon />,
    page: <FarmTableArea />,
    previousPages: [HomePage]
}

