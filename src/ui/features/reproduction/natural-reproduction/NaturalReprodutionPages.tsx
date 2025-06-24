import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { NaturalMatingTable } from "./table/NaturalMatingTable";
import { HomePage } from "@/ui/features/home/HomePage";

export const NaturalMatingTablePage: PageProps = {
    title: "Histórico de Monta Natural",
    page: <NaturalMatingTable />,
    previousPages: [HomePage]
}
