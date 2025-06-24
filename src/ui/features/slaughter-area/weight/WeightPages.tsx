import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "@/ui/features/home/HomePage";
import { WeightTable } from "./table/WeightTable";

export const WeightTablePage: PageProps = {
    title: "Histórico de Pesagem",
    page: <WeightTable />,
    previousPages: [HomePage]
}
