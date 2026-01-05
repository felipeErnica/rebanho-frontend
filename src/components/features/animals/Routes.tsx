import { AppRoute } from "@/Routes";
import { AnimalsDashboard } from "./main-dashboard/AnimalsDashboard";
import { AnimalsTablePage } from "./AnimalsTablePage";

export const animalRoutes: AppRoute[] = [
    {
        index: true,
        element: <AnimalsDashboard />,
    },
    {
        path: 'animals',
        element: <AnimalsTablePage />,
        handle: { title: 'Tabela de Animais' }
    }
]
