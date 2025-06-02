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
} from "@/ui/components/common/OtherIcons"
import Scale from "@mui/icons-material/Scale"
import Vaccines from "@mui/icons-material/Vaccines"
import { SlaughterDisplay } from "@/ui/features/slaughter-area/slaughter/SlaughterDisplay"
import { InseminationDisplay } from "@/ui/features/reproduction/insemination/InseminationDisplay"
import { BirthDisplay } from "@/ui/features/reproduction/births/BirthDisplay"
import { NaturalMatingDisplay } from "@/ui/features/reproduction/natural-reproduction/NaturalMatingDisplay"
import { EmbryoTransferDisplay } from "@/ui/features/reproduction/embryo-transfer/EmbryoTransferDisplay"
import { LossDisplay } from "@/ui/features/reproduction/pregnancy-loss/LossDisplay"
import { SlaughterhouseDisplay } from "@/ui/features/slaughter-area/slaughterhouse/SlaughterhouseDisplay"
import { WeightDisplay } from "@/ui/features/slaughter-area/weight/WeightDisplay"
import { MilkDisplay } from "@/ui/features/lactation/milk-entries/MilkEntryDisplay"
import { LactationDisplay } from "@/ui/features/lactation/lactation-hist/LactationHistDisplay"
import { AnimalsDashboard } from "@/ui/features/animals/dashboard/AnimalsDashboard"

export type MenuItem = {
    key: string
    title: string
    icon: ReactNode
    collapsedList?: MenuItem[]
    page?: ReactNode | ReactNode[]
}

export const buildList = () => {

    const reproductionSubMenu: MenuItem[] = [
        {
            key: 'births',
            title: 'Parição',
            icon: <CalfIcon />,
            page: <BirthDisplay />
        },
        {
            key: 'insemination',
            title: 'Inseminação',
            icon: <InseminationIcon />,
            page: <InseminationDisplay />
        },
        {
            key: 'mating',
            title: 'Monta Natural',
            icon: <BullIcon />,
            page: <NaturalMatingDisplay />
        },
        {
            key: 'embryo-transfer',
            title: 'Transferência Embrionária',
            icon: <EmbryoIcon />,
            page: <EmbryoTransferDisplay />
        },
        {
            key: 'birth-test',
            title: 'Exames de Toque',
            icon: <BirthTestIcon />,
            page: <BirthDisplay />
        },
        {
            key: 'pregnancy-loss',
            title: 'Perdas e Abortos',
            icon: <PregnancyLossIcon />,
            page: <LossDisplay />
        },
    ]

    const slaughterSubMenu: MenuItem[] = [
        {
            key: 'slaughter',
            title: 'Abates',
            icon: <SlaughterIcon />,
            page: <SlaughterDisplay />
        },
        {
            key: 'slaughterhouse',
            title: 'Frigoríficos Registrados',
            icon: <SlaughterhouseIcon />,
            page: <SlaughterhouseDisplay />
        },
        {
            key: 'weight',
            title: 'Pesagens',
            icon: <Scale />,
            page: <WeightDisplay />
        },
    ]

    const lactationSubMenu: MenuItem[] = [
        {
            key: 'lactation',
            title: 'Histórico de Lactações',
            icon: <LactationHistIcon />,
            page: <LactationDisplay />
        },
        {
            key: 'milk-entries',
            title: 'Marcação de Leite',
            icon: <MilkIcon />,
            page: <MilkDisplay />
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
            icon: <Home />
        },
        {
            key: 'animals-table',
            title: 'Animais',
            icon: <CowHeadIcon />,
            page: <AnimalsDashboard />
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
