import { PageProps } from "@/ui/shared/main-page/PageDisplay";
import { EmbryoTransferTable } from "./table/EmbryoTransferTable";
import { HomePage } from "../../home/HomePage";

export const EmbryoTablePage: PageProps = {
    title: "Histórico de Transferência de Embrião",
    page: <EmbryoTransferTable />,
    previousPages: [HomePage]
}
