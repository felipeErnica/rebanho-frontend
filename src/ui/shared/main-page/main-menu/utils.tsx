import Home from "@mui/icons-material/Home"
import { ReactNode } from "react"
import {
    BirthTestIcon,
    CalfIcon,
    CowHeadIcon,
    EmbryoIcon,
    InseminationIcon,
    LactationIcon,
    ReproductionIcon,
    SlaughterIcon,
    FarmMainIcon,
    BullIcon
} from "@/ui/shared/common/OtherIcons"
import Scale from "@mui/icons-material/Scale"
import Vaccines from "@mui/icons-material/Vaccines"
import { PageProps } from "../PageDisplay"
import { BirthPage } from "@/ui/features/reproduction/births/BirthPages"
import { InseminationPage } from "@/ui/features/reproduction/insemination/InseminationPages"
import { TransferMainPage } from "@/ui/features/reproduction/embryo-transfer/EmbryoTransferPages"
import { BirthTestDashboardPage } from "@/ui/features/reproduction/pregnancy-test/BirthTestPages"
import { HomePage } from "@/ui/features/home/HomePage"
import { MilkDashboardPage } from "@/ui/features/lactation/LactationPages"
import { AnimalDashboardPage } from "@/ui/features/animals/AnimalsPage"
import { FarmPage } from "@/ui/features/farm-area/FarmPage"
import { WeightMainPage } from "@/ui/features/weight/WeightPages"
import { SlaughterMainPage } from "@/ui/features/slaughter/SlaughterPages"
import { MatingMainPage } from "@/ui/features/reproduction/natural-mating/NaturalMatingPages"

export type MenuItem = {
    key: string
    title: string
    icon: ReactNode | ReactNode[]
    collapsedList?: MenuItem[]
    page?: PageProps
}

export const buildList = () => {

    const reproductionSubMenu: MenuItem[] = [
        {
            key: 'births',
            title: 'Parição',
            icon: <CalfIcon />,
            page: BirthPage
        },
        {
            key: 'birth-test',
            title: 'Exames de Toque',
            icon: <BirthTestIcon />,
            page: BirthTestDashboardPage
        },
        {
            key: 'insemination',
            title: 'Inseminação',
            icon: <InseminationIcon />,
            page: InseminationPage
        },
        {
            key: 'mating',
            title: 'Cobertura',
            icon: <BullIcon />,
            page: MatingMainPage
        },
        {
            key: 'embryo-transfer',
            title: 'Transferência Embrionária',
            icon: <EmbryoIcon />,
            page: TransferMainPage
        },
    ]

    const mainList: MenuItem[] = [
        {
            key: 'home',
            title: 'Início',
            icon: <Home />,
            page: HomePage
        },
        {
            key: 'animals-table',
            title: 'Animais',
            icon: <CowHeadIcon />,
            page: AnimalDashboardPage
        },
        {
            key: 'farm-pastures',
            title: 'Fazendas e Pastos',
            icon: <FarmMainIcon />,
            page: FarmPage
        },
        {
            key: 'reproduction',
            title: 'Área Reprodutiva',
            icon: <ReproductionIcon />,
            collapsedList: reproductionSubMenu
        },
        {
            key: 'weight',
            title: 'Pesagens',
            icon: <Scale />,
            page: WeightMainPage
        },
        {
            key: 'slaughter-weight',
            title: 'Abate',
            icon: <SlaughterIcon />,
            page: SlaughterMainPage
        },
        {
            key: 'lactation-area',
            title: 'Lactação',
            icon: <LactationIcon />,
            page: MilkDashboardPage
        },
        {
            key: 'vacines',
            title: 'Vacinação',
            icon: <Vaccines />,
        },
    ]

    return mainList
}
