import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { LossTable } from "../../reproduction/pregnancy-loss/table/LossTable";
import { HomePage } from "@/ui/features/home/HomePage";

export const SlaughterTablePage: PageProps = {
    title: "Histórico de Abates",
    page: <LossTable />,
    previousPages: [HomePage]
}
