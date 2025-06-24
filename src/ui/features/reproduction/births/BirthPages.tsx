import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { BirthTable } from "./table/BirthTable";
import { HomePage } from "../../home/HomePage";

export const BirthTablePage: PageProps = {
    title: "Tabela de Parições",
    page: <BirthTable />,
    previousPages: [HomePage]
}
