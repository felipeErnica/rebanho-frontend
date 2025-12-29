import { LactationIcon } from "@shared/common/OtherIcons";
import { MilkEntriesTablePage } from "./MilkEntriesTable";
import { GroupTablePage } from "./MilkGroupTable";
import { LactationHistTablePage } from "./LactationHistTable";
import { AppRoute } from "@/Routes";
import { LactationDashboard } from "./LactationDashboard";
import { Outlet, useParams } from "react-router";
import { LactationEntriesTablePage } from "./LactationEntriesTable";
import { findLactationById } from "./Controller";
import { LactationHist } from "./Entities";
import { dateTransform } from "@/utils/Transformations";
import { GroupEntriesTablePage } from "./GroupEntriesTable";

const GroupEntriesTablePageWrapper = () => {
    const { entryDate } = useParams<{ entryDate: string }>();
    return <GroupEntriesTablePage entryDate={new Date(entryDate!)} />;
};

const LactationEntriesTablePageWrapper = () => {
    const { lactationId } = useParams<{ lactationId: string }>();
    return <LactationEntriesTablePage lactationId={lactationId!} />;
};

function buildTitle(name: string, startDate: Date, endDate: Date | undefined) {
    const startDateStr = dateTransform(startDate)
    const endDateStr = endDate ? dateTransform(endDate) : 'Hoje'

    return `Lactação - ${name} (Início: ${startDateStr} - Fim: ${endDateStr})`
}

export const lactationRoutes: AppRoute = {
    path: 'lactation',
    element: <Outlet />,
    handle: {
        title: "Lactação",
        icon: <LactationIcon />,
    },
    children: [
        {
            index: true,
            element: <LactationDashboard />,
        },
        {
            path: "milk",
            element: <Outlet />,
            children: [
                {
                    index: true,
                    element: <MilkEntriesTablePage />,
                    handle: { title: "Histórico de Marcações" }
                },
                {
                    path: 'groups',
                    element: <GroupTablePage />,
                    handle: { title: "Dias de Marcação" }
                },
                {
                    path: ':entryDate',
                    element: <GroupEntriesTablePageWrapper />,
                    handle: { title: (params) => `Leite - ${dateTransform(new Date(params.entryDate))}` }
                },
            ]
        },
        {
            path: "history",
            element: <Outlet />,
            handle: { title: "Histórico de Lactações" },
            children: [
                {
                    index: true,
                    element: <LactationHistTablePage />,
                },
                {
                    path: ":lactationId",
                    element: <LactationEntriesTablePageWrapper />,
                    loader: async ({ params }) => {
                        const { lactationId } = params
                        return findLactationById(lactationId)
                    },
                    handle: {
                        title: (_, data?: LactationHist) => buildTitle(data.animalName, data.startDate, data.endDate) 
                    }
                }
            ]
        }
    ]
}
