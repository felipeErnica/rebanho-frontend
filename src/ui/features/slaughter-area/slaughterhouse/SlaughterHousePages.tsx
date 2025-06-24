import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { SlaughterHouseTable } from "./table/SlaughterHouseTable";
import { HomePage } from "@/ui/features/home/HomePage";

export const SlaughterHouseTablePage: PageProps = {
    title: "Tabela de Frigoríficos",
    page: <SlaughterHouseTable />,
    previousPages: [HomePage]
}
