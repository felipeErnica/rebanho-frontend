import { FarmMainIcon } from "@shared/common/OtherIcons";
import { PageProps } from "@shared/main-page/PageDisplay";
import { HomePage } from "@features/home/HomePage";
import { FarmTableArea } from "./main-table/FarmTableArea";

export const FarmPage: PageProps = {
    title: "Fazendas e Pastos",
    crumbIcon: <FarmMainIcon />,
    page: <FarmTableArea />,
    previousPages: [HomePage]
}

