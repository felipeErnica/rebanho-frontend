import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { HomePage } from "@/ui/features/home/HomePage";
import { LossDashboard } from "../../reproduction/pregnancy-loss/LossDashboard";

export const SlaughterTablePage: PageProps = {
    title: "Histórico de Abates",
    page: <LossDashboard />,
    previousPages: [HomePage]
}
