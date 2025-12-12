import List from "@mui/material/List";
import { JSX } from "react";
import { MenuButton } from "./MenuButton";
import { buildList } from "./utils";
import IconButton from "@mui/material/IconButton";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import { PageProps } from "../PageDisplay";

type MenuProps = {
    setPage: (page?: PageProps) => void
    setOpen: (open: boolean) => void
}

export const MainMenu = ({ setPage, setOpen }: MenuProps): JSX.Element => {

    const mainList = buildList()

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
            {mainList.map(item => <MenuButton item={item} setPage={setPage} />)}
        </List>
    </div>
}
