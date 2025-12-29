import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import Scale from "@mui/icons-material/Scale";
import { WeightDashboard } from "./WeightDashboard";
import { WeightEntriesTable } from "./WeightEntriesTable";
import { WeightGroupTable } from "./WeightGroupTable";
import { WeightGroupEntriesTable } from "./WeightGroupEntriesTable";
import { useParams } from "react-router";
import { dateTransform } from "@/utils/Transformations";

const WeightGroupEntriesTablePage = () => {
    const { entryDate } = useParams<{ entryDate: string }>();
    return <WeightGroupEntriesTable entryDate={new Date(entryDate!)} />;
};

export const weightRoutes: AppRoute = {
    path: "weight",
    element: <Outlet />,
    handle: {
        title: "Pesagens",
        icon: <Scale />,
    },
    children: [
        {
            index: true,
            element: <WeightDashboard />,
        },
        {
            path: "entries",
            element: <WeightEntriesTable />,
            handle: { title: "Marcações de Peso" },
        },
        {
            path: "groups",
            element: <WeightGroupTable />,
            handle: { title: "Pesagens" },
        },
        {
            path: "groups/:entryDate",
            element: <WeightGroupEntriesTablePage />,
            handle: {
                title: (params) => `Pesagem - ${dateTransform(new Date(params.entryDate))}`,
            },
        },
    ],
};
