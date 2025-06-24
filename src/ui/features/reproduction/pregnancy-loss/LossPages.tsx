import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { LossTable } from "./table/LossTable";
import { HomePage } from "../../home/HomePage";

export const LossTablePage: PageProps = {
    title: "Histórico de Perdas",
    page: <LossTable />,
    previousPages: [HomePage]
}
