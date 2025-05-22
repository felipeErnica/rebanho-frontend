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
    BullIcon} from "@/ui/components/common/OtherIcons"
import Scale from "@mui/icons-material/Scale"
import Vaccines from "@mui/icons-material/Vaccines"

export type MenuItem = {
    key: string
    title: string
    icon: ReactNode
    collapsedList?: MenuItem[]
}

export const buildList = () => {

    const reproductionSubMenu: MenuItem[] = [
        {
            key: 'births',
            title: 'Parição',
            icon: <CalfIcon />
        },
        {
            key: 'insemination',
            title: 'Inseminação',
            icon: <InseminationIcon />
        },
        {
        key: 'mating',
            title: 'Monta Natural',
            icon: <BullIcon />
        },
        {
            key: 'embryo-transfer',
            title: 'Transferência Embrionária',
            icon: <EmbryoIcon />
        },
        {
            key: 'birth-test',
            title: 'Exames de Toque',
            icon: <BirthTestIcon />
        },
        {
            key: 'pregnancy-loss',
            title: 'Perdas e Abortos',
            icon: <PregnancyLossIcon />
        },
    ]

    const slaughterSubMenu: MenuItem[] = [
        {
            key: 'slaughter',
            title: 'Abates',
            icon: <SlaughterIcon />
        },
        {
            key: 'slaughterhouse',
            title: 'Frigoríficos Registrados',
            icon: <SlaughterhouseIcon />
        },
        {
            key: 'weight',
            title: 'Pesagens',
            icon: <Scale />
        },
    ]

    const lactationSubMenu: MenuItem[] = [
        {
            key: 'lactation',
            title: 'Histórico de Lactações',
            icon: <LactationHistIcon />
        },
        {
            key: 'milk-entries',
            title: 'Marcação de Leite',
            icon: <MilkIcon />
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
