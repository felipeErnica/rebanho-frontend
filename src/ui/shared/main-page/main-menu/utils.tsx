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
    LactationHistIcon,
    PregnancyLossIcon,
    ReproductionIcon,
    SlaughterhouseIcon,
    SlaughterIcon,
    MilkIcon,
    FarmIcon,
    FarmMainIcon,
    FenceIcon,
    BullIcon
} from "@/ui/shared/common/OtherIcons"
import Scale from "@mui/icons-material/Scale"
import Vaccines from "@mui/icons-material/Vaccines"
import { PageProps } from "../PageDisplay"
import { BirthTablePage } from "@/ui/features/reproduction/births/BirthPages"
import { InseminationTablePage } from "@/ui/features/reproduction/insemination/InseminationPages"
import { NaturalMatingTablePage } from "@/ui/features/reproduction/natural-reproduction/NaturalReprodutionPages"
import { EmbryoTablePage } from "@/ui/features/reproduction/embryo-transfer/EmbryoTransferPages"
import { BirthTestTablePage } from "@/ui/features/reproduction/birth-test/BirthTestPages"
import { LossTablePage } from "@/ui/features/reproduction/pregnancy-loss/LossPages"
import { SlaughterTablePage } from "@/ui/features/slaughter-area/slaughter/SlaughterPages"
import { SlaughterHouseTablePage } from "@/ui/features/slaughter-area/slaughterhouse/SlaughterHousePages"
import { WeightTablePage } from "@/ui/features/slaughter-area/weight/WeightPages"
import { HomePage } from "@/ui/features/home/HomePage"
import { LactationHistTablePage, MilkTablePage } from "@/ui/features/lactation/LactationPages"
import { AnimalDashboardPage } from "@/ui/features/animals/AnimalsPage"

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
            page: BirthTablePage
        },
        {
            key: 'insemination',
            title: 'Inseminação',
            icon: <InseminationIcon />,
            page: InseminationTablePage
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
            page: BirthTestTablePage
        },
        {
            key: 'pregnancy-loss',
            title: 'Perdas e Abortos',
            icon: <PregnancyLossIcon />,
            page: LossTablePage
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
        {
            key: 'weight',
            title: 'Pesagens',
            icon: <Scale />,
            page: WeightTablePage
        },
    ]

    const lactationSubMenu: MenuItem[] = [
        {
            key: 'lactation',
            title: 'Histórico de Lactações',
            icon: <LactationHistIcon />,
            page: LactationHistTablePage
        },
        {
            key: 'milk-entries',
            title: 'Marcação de Leite',
            icon: <MilkIcon />,
            page: MilkTablePage
        },
    ]

    const pasturesSubMenu: MenuItem[] = [
        {
            key: 'farms',
            title: 'Fazendas',
            icon: <FarmIcon />
        },
        {
            key: 'pastures',
            title: 'Pastos',
            icon: <FenceIcon />
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
            collapsedList: pasturesSubMenu
        },
        {
            key: 'reproduction',
            title: 'Reprodução e Inseminação',
            icon: <ReproductionIcon />,
            collapsedList: reproductionSubMenu
        },
        {
            key: 'slaughter-weight',
            title: 'Pesagem e Abate',
            icon: <CowIcon />,
            collapsedList: slaughterSubMenu
        },
        {
            key: 'lactation-area',
            title: 'Lactação',
            icon: <LactationIcon />,
            collapsedList: lactationSubMenu
        },
        {
            key: 'vacines',
            title: 'Vacinação',
            icon: <Vaccines />,
        },
    ]

    return mainList
}
