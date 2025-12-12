import Typography from "@mui/material/Typography"
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { MaximizeIcon, MinimizeIcon } from "@shared/common/OtherIcons";

type TitleBarProps = {
    setOpen: (open: boolean) => void
}

export const TitleBar = ({ setOpen }: TitleBarProps) => {
    return <AppBar className="bg-gray-700 shadow-none" position="static">
        <Toolbar className="flex flex-row gap-4 grow">
            <IconButton className="hover:bg-gray-600 text-white" onClick={() => setOpen(true)}>
                <MenuIcon />
            </IconButton>
            <Typography className="text-white" variant="h6">PLACEHOLDER</Typography>
            <div className="flex items-center flex-row-reverse gap-6 grow">
                <div className="grid grid-cols-3 gap-2">
                    <IconButton 
                        onClick={() => window.electronEvents.minimizeMain()}
                        className="hover:bg-gray-600 text-white"
                    >
                        <MinimizeIcon />
                    </IconButton>
                    <IconButton 
                        onClick={() => window.electronEvents.maximizeMain()}
                        className="hover:bg-gray-600 text-white"
                    >
                        <MaximizeIcon />
                    </IconButton>
                    <IconButton 
                        onClick={() => window.electronEvents.closeMain()}
                        className="hover:bg-red-400 text-white"
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </div>
                <IconButton className="hover:bg-gray-600 text-white">
                    <AccountCircle />
                </IconButton>
            </div>
        </Toolbar>
    </AppBar>
}
