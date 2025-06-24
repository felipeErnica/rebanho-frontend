import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { InseminationTable } from "./table/InseminationTable";
import { HomePage } from "@/ui/features/home/HomePage";

export const InseminationTablePage: PageProps = {
    title: "Tabela de Inseminação",
    page: <InseminationTable />,
    previousPages: [HomePage]
}
