import Home from "@mui/icons-material/Home"
import { ReactNode } from "react"
import {
    BirthTestIcon,
    CalfIcon,
    CowHeadIcon,
    CowIcon,
    EmbryoIcon,
    InseminationIcon,
    LactationIcon,
    PregnancyLossIcon,
    ReproductionIcon,
    SlaughterhouseIcon,
    SlaughterIcon,
    FarmMainIcon,
    BullIcon
} from "@/ui/shared/common/OtherIcons"
import Scale from "@mui/icons-material/Scale"
import Vaccines from "@mui/icons-material/Vaccines"
import { PageProps } from "../PageDisplay"
import { BirthPage } from "@/ui/features/reproduction/births/BirthPages"
import { InseminationPage } from "@/ui/features/reproduction/insemination/InseminationPages"
import { NaturalMatingTablePage } from "@/ui/features/reproduction/natural-reproduction/NaturalReprodutionPages"
import { EmbryoTablePage } from "@/ui/features/reproduction/embryo-transfer/EmbryoTransferPages"
import { BirthTestDashboardPage } from "@/ui/features/reproduction/birth-test/BirthTestPages"
import { LossDashboardPage } from "@/ui/features/reproduction/pregnancy-loss/LossPages"
import { SlaughterTablePage } from "@/ui/features/slaughter-area/slaughter/SlaughterPages"
import { SlaughterHouseTablePage } from "@/ui/features/slaughter-area/slaughterhouse/SlaughterHousePages"
import { HomePage } from "@/ui/features/home/HomePage"
import { MilkDashboardPage } from "@/ui/features/lactation/LactationPages"
import { AnimalDashboardPage } from "@/ui/features/animals/AnimalsPage"
import { FarmPage } from "@/ui/features/farm-area/FarmPage"
import { WeightMainPage } from "@/ui/features/weight/WeightPages"

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
            key: 'insemination',
            title: 'Inseminação',
            icon: <InseminationIcon />,
            page: InseminationPage
        },
        {
            key: 'mating',
            title: 'Monta Natural',
            icon: <BullIcon />,
            page: NaturalMatingTablePage
        },
        {
            key: 'embryo-transfer',
            title: 'Transferência Embrionária',
            icon: <EmbryoIcon />,
            page: EmbryoTablePage
        },
        {
            key: 'birth-test',
            title: 'Exames de Toque',
            icon: <BirthTestIcon />,
            page: BirthTestDashboardPage
        },
        {
            key: 'pregnancy-loss',
            title: 'Perdas e Abortos',
            icon: <PregnancyLossIcon />,
            page: LossDashboardPage
        },
    ]

    const slaughterSubMenu: MenuItem[] = [
        {
            key: 'slaughter',
            title: 'Abates',
            icon: <SlaughterIcon />,
            page: SlaughterTablePage
        },
        {
            key: 'slaughterhouse',
            title: 'Frigoríficos Registrados',
            icon: <SlaughterhouseIcon />,
            page: SlaughterHouseTablePage
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
            title: 'Reprodução e Inseminação',
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
            icon: <CowIcon />,
            collapsedList: slaughterSubMenu
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
