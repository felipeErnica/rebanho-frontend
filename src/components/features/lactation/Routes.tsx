import { LactationIcon } from "@shared/common/OtherIcons";
import { LactationHistTablePage } from "./LactationHistTable";
import { AppRoute } from "@/Routes";
import { LactationDashboard } from "./LactationDashboard";
import { Outlet, useParams } from "react-router";
import { findLactationById } from "./Service";
import { Lactation } from "./Entities";
import { dateTransform } from "@/utils/Transformations";
import { GroupEntriesTablePage } from "@features/milk/GroupEntriesTable";
import { LactationEntriesTablePage } from "@features/milk/LactationEntriesTable";
import { MilkEntriesTablePage } from "@features/milk/MilkEntriesTable";
import { GroupTablePage } from "@features/milk/MilkGroupTable";
import { LacAnimalsTablePage } from "./LacAnimalsTable";
import { Animal, getAnimalLabel } from "@features/animals/Entities";
import { LONG_LACTATION_DAYS } from "@shared/Globals";

const GroupEntriesTablePageWrapper = () => {
    const { entryDate } = useParams<{ entryDate: string }>();
    return <GroupEntriesTablePage entryDate={new Date(entryDate!)} />;
};

const LactationEntriesTablePageWrapper = () => {
    const { lactationId } = useParams<{ lactationId: string }>();
    return <LactationEntriesTablePage lactationId={lactationId!} />;
};

function buildTitle(cow: Animal, startDate: Date, endDate: Date | undefined) {
    const startDateStr = dateTransform(startDate)
    const endDateStr = endDate ? dateTransform(endDate) : 'Hoje'

    return `Lactação - ${getAnimalLabel(cow)} (Início: ${startDateStr} - Fim: ${endDateStr})`
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
                    element: <LactationHistTablePage {...{ isFiltered: false }} />,
                },
                {
                    path: ":lactationId",
                    element: <LactationEntriesTablePageWrapper />,
                    loader: async ({ params }) => {
                        const { lactationId } = params
                        return findLactationById(lactationId)
                    },
                    handle: {
                        title: (_, data?: Lactation) => buildTitle(data.cow, data.startDate, data.endDate)
                    }
                }
            ]
        },
        {
            path: "dry-animals",
            element: <Outlet />,
            handle: { title: "Vacas Secas" },
            children: [
                {
                    index: true,
                    element: <LacAnimalsTablePage {...{ isFiltered: true, isLactating: false }} />,
                },
                {
                    path: ":lactationId",
                    element: <LactationEntriesTablePageWrapper />,
                    loader: async ({ params }) => {
                        const { lactationId } = params
                        return findLactationById(lactationId)
                    },
                    handle: {
                        title: (_, data?: Lactation) => buildTitle(data.cow, data.startDate, data.endDate)
                    }
                }

            ]
        },
        {
            path: "lac-animals",
            element: <Outlet />,
            handle: { title: "Vacas em Lactação" },
            children: [
                {
                    index: true,
                    element: <LacAnimalsTablePage {...{ isLactating: true, isFiltered: true }} />,
                },
                {
                    path: ":lactationId",
                    element: <LactationEntriesTablePageWrapper />,
                    loader: async ({ params }) => {
                        const { lactationId } = params
                        return findLactationById(lactationId)
                    },
                    handle: {
                        title: (_, data?: Lactation) => buildTitle(data.cow, data.startDate, data.endDate)
                    }
                }

            ]
        },
        {
            path: 'long-lactations',
            element: <Outlet />,
            handle: { title: 'Lactações Longas' },
            children: [
                {
                    index: true,
                    element: (
                        <LactationHistTablePage {...{
                            isFiltered: true,
                            minLacPeriod: LONG_LACTATION_DAYS,
                            hasEndDate: false
                        }} />
                    ),
                },
                {
                    path: ":lactationId",
                    element: <LactationEntriesTablePageWrapper />,
                    loader: async ({ params }) => {
                        const { lactationId } = params
                        return findLactationById(lactationId)
                    },
                    handle: {
                        title: (_, data?: Lactation) => buildTitle(data.cow, data.startDate, data.endDate)
                    }
                }
            ]
        }
    ]
}
