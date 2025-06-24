import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { BirthTestTable } from "./table/BirthTestTable";
import { HomePage } from "@/ui/features/home/HomePage";

export const BirthTestTablePage: PageProps = {
    title: "Histórico de Toques",
    page: <BirthTestTable />,
    previousPages: [HomePage]
}
