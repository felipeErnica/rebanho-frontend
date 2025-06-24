import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { LactationHistTable } from "./lactation-hist/LactationHistTable";
import { HomePage } from "@/ui/features/home/HomePage";
import { MilkTable } from "./milk-entries/MilkEntryDisplay";

export const LactationHistTablePage: PageProps = {
    title: "Histórico de Lactações",
    page: <LactationHistTable />,
    previousPages: [HomePage]
}

export const MilkTablePage: PageProps = {
    title: "Histórico de Marcações de Leite",
    page: <MilkTable />, 
    previousPages: [HomePage]
}
