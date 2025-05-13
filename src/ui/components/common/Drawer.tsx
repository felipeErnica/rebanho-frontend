import { JSX } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";

interface AbstractDrawerProps {
    title: string;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    childPanel: () => JSX.Element
}

interface DrawerProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    childPanel: () => JSX.Element
}

const Drawer = (props: AbstractDrawerProps): JSX.Element => {

    return <div
        className={`h-full grid grid-rows-[auto_1fr] transition-all duration-500 ease-in-out overflow-auto
        ${props.isOpen ? 'max-w-96' : 'max-w-0'}`}
    >
        <AppBar className="sticky bg-gray-700 top-0 grid grid-cols-[auto_1fr] gap-2 items-center p-4">
            <IconButton onClick={() => props.setOpen(false)}>
                <Close className="text-white" />
            </IconButton>
            <Typography
                variant="h5"
                className="overflow-clip whitespace-nowrap text-white"
            >
                {props.title}
            </Typography>
        </AppBar>
        <div className="p-4">
            {props.childPanel()}
        </div>
    </div>
}

export const FilterDrawer = (props: DrawerProps) => {
    return <Drawer
        title="CONTROLES DE FILTRO"
        childPanel={props.childPanel}
        isOpen={props.isOpen}
        setOpen={props.setOpen}
    />
}
