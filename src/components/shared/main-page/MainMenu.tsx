import List from "@mui/material/List";
import { JSX, ReactNode } from "react";
import { MenuButton } from "./MenuButton";
import IconButton from "@mui/material/IconButton";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Home from "@mui/icons-material/Home";
import {
    BirthTestIcon,
    BullIcon,
    CalfIcon,
    EmbryoIcon,
    FarmMainIcon,
    InseminationIcon,
    LactationIcon,
    ReproductionIcon,
    SlaughterIcon
} from "@shared/common/OtherIcons";
import Scale from "@mui/icons-material/Scale";
import Vaccines from "@mui/icons-material/Vaccines";

type MenuProps = { setOpen: (open: boolean) => void }

export type MenuItem = {
    key: string
    title: string
    icon: ReactNode
    children?: MenuItem[]
    path: string
}

const menuList: MenuItem[] = [
    {
        key: 'animals',
        title: 'Início',
        icon: <Home />,
        path: ""
    },
    {
        key: 'farm-pastures',
        title: 'Fazendas e Pastos',
        icon: <FarmMainIcon />,
        path: "farm-pastures"
    },
    {
        key: 'births',
        title: 'Parição',
        icon: <CalfIcon />,
        path: "births"
    },
    {
        key: 'birth-test',
        title: 'Exames de Toque',
        icon: <BirthTestIcon />,
        path: "birth-test"
    },
    {
        key: 'reproduction',
        title: 'Área Reprodutiva',
        icon: <ReproductionIcon />,
        path: "reproduction",
        children: [
            {
                key: 'insemination',
                title: 'Inseminação',
                icon: <InseminationIcon />,
                path: "insemination"
            },
            {
                key: 'mating',
                title: 'Cobertura',
                icon: <BullIcon />,
                path: "mating"
            },
            {
                key: 'embryo-transfer',
                title: 'Transferência Embrionária',
                icon: <EmbryoIcon />,
                path: "embryo-transfer"
            },
        ]
    },
    {
        key: 'weight',
        title: 'Pesagens',
        icon: <Scale />,
        path: "weight"
    },
    {
        key: 'slaughter-weight',
        title: 'Abate',
        icon: <SlaughterIcon />,
        path: "slaughter-weight"
    },
    {
        key: 'lactation-area',
        title: 'Lactação',
        icon: <LactationIcon />,
        path: "lactation"
    },
    {
        key: 'vacines',
        title: 'Vacinação',
        icon: <Vaccines />,
        path: "vacines"
    },
]

export const MainMenu = ({ setOpen }: MenuProps): JSX.Element => {

    return <div className="h-full overflow-auto w-100 bg-gray-700">
        <AppBar className="shadow-none sticky bg-gray-700 flex flex-col">
            <div className="flex flex-row-reverse py-4 px-2">
                <IconButton className="text-white hover:bg-gray-600" onClick={() => setOpen(false)}>
                    <ChevronLeft fontSize="large" />
                </IconButton>
            </div>
            <Divider className="bg-gray-400" />
        </AppBar>
        <List>
            {menuList.map(item => <MenuButton item={item} />)}
        </List>
    </div>
}
