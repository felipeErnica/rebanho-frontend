import { LactationIcon } from "@shared/common/OtherIcons";
import { MilkEntriesTablePage } from "./MilkEntriesTable";
import { GroupTablePage } from "./MilkGroupTable";
import { LactationHistTablePage } from "./LactationHistTable";
import { AppRoute } from "@/Routes";
import { LactationDashboard } from "./LactationDashboard";
import { Outlet } from "react-router";
import { LactationEntriesTablePage } from "./LactationEntriesTable";
import { findLactationById } from "./Controller";
import { LactationHist } from "./Entities";
import { dateTransform } from "@/utils/Transformations";
import { GroupEntriesTablePage } from "./GroupEntriesTable";

export const lactationRoutes: AppRoute[] = [
    {
        path: 'lactation',
        element: <Outlet />,
        children: [
            {
                index: true,
                element: <LactationDashboard />,
                handle: {
                    title: "Painel de Lactação",
                    icon: <LactationIcon />,
                },
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
                        element: <GroupEntriesTablePage />,
                        handle: { title: (params) => `Leite - ${dateTransform(new Date(params.entryDate))}` }
                    },
                ]
            },
            {
                path: "history",
                element: <LactationHistTablePage />,
                handle: { title: "Histórico de Lactações" },
                children: [
                    {
                        path: ":lactationId",
                        element: <LactationEntriesTablePage />,
                        loader: async ({ params }) => {
                            const { lactationId } = params
                            return findLactationById(lactationId)
                        },
                        handle: {
                            title: (_, data?: LactationHist) => `Lactação - ${data.animalName} ` +
                                `(Início: ${dateTransform(data.startDate)} - Fim: ${data.endDate})`
                        }
                    }
                ]
            }
        ]
    }
]
