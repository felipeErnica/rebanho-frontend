import { AppRoute } from "@/Routes";
import { Outlet } from "react-router";
import { FarmMainIcon } from "@shared/common/OtherIcons";
import { FarmTableArea } from "./main-table/FarmTableArea";
import { FarmAnimalsPage } from "./farm-animals/FarmAnimalsPage";
import { PastureAnimalsPage } from "./pasture-animals/PastureAnimalsPage";
import { PastureEntriesPage } from "./pasture-entries/PastureEntriesPage";
import { useParams } from "react-router";

const FarmAnimalsPageWrapper = () => {
    const { farmId } = useParams<{ farmId: string }>();
    return <FarmAnimalsPage farmId={farmId!} />;
};

const PastureAnimalsPageWrapper = () => {
    const { pastureId } = useParams<{ pastureId: string }>();
    return <PastureAnimalsPage pastureId={pastureId!} />;
};

const PastureEntriesPageWrapper = () => {
    const { pastureId } = useParams<{ pastureId: string }>();
    return <PastureEntriesPage pastureId={pastureId!} />;
};

export const farmAreaRoutes: AppRoute = {
    path: "farm-pastures",
    element: <Outlet />,
    handle: {
        title: "Fazendas e Pastos",
        icon: <FarmMainIcon />,
    },
    children: [
        {
            index: true,
            element: <FarmTableArea />,
            handle: {
                title: "Fazendas e Pastos",
            },
        },
        {
            path: "farms/:farmId/animals",
            element: <FarmAnimalsPageWrapper />,
            handle: {
                title: "Animais da Fazenda",
            },
        },
        {
            path: "pastures/:pastureId/animals",
            element: <PastureAnimalsPageWrapper />,
            handle: {
                title: "Animais do Pasto",
            },
        },
        {
            path: "pastures/:pastureId/entries",
            element: <PastureEntriesPageWrapper />,
            handle: {
                title: "Entradas do Pasto",
            },
        },
    ],
};
