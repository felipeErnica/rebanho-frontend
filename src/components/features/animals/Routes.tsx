import { AppRoute } from "@/Routes";
import { AnimalsDashboard } from "./AnimalsDashboard";
import { AnimalsTablePage } from "./AnimalsTablePage";

export const animalRoutes: AppRoute[] = [
    {
        index: true,
        element: <AnimalsDashboard />,
    },
    {
        path: 'animals',
        element: <AnimalsTablePage {...{ isFiltered: false }} />,
        handle: { title: 'Tabela de Animais' }
    },
    {
        path: 'dead-animals',
        element: <AnimalsTablePage {...{ isFiltered: true, hasDeath: true }} />,
        handle: { title: 'Animais Mortos' }
    },
    {
        path: 'offspring',
        element: <AnimalsTablePage {...{ isFiltered: true, types: ['OFFSPRING'] }} />,
        handle: { title: 'Animais Jovens' }
    }
]
