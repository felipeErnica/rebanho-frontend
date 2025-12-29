import { FarmMainIcon } from "@shared/common/OtherIcons";
import { AppRoute } from "@shared/main-page/PageDisplay";
import { HomePage } from "@features/home/HomePage";
import { FarmTableArea } from "./main-table/FarmTableArea";

export const FarmPage: AppRoute = {
    title: "Fazendas e Pastos",
    icon: <FarmMainIcon />,
    page: <FarmTableArea />,
    previousPages: [HomePage]
}

