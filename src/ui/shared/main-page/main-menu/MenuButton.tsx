import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { useState } from "react"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { MenuItem } from "./utils"
import List from "@mui/material/List"
import { Collapse } from "@mui/material";
import { PageProps } from "../PageDisplay";

type MenuButtonProps = {
    item: MenuItem
    setPage: (page?: PageProps) => void
}

const NormalButton = ({ item, setPage }: MenuButtonProps) => {

    return <ListItemButton
        key={item.key}
        className="text-white py-4 hover:bg-gray-600"
        onClick={() => setPage(item.page)}
    >
        <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
        <ListItemText>{item.title}</ListItemText>
    </ListItemButton>
}

const NestedButton = ({ item, setPage }: MenuButtonProps) => {

    return <ListItemButton
        key={item.key}
        className="text-white pl-10 py-4 hover:bg-gray-600"
        onClick={() => setPage(item.page)}
    >
        <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
        <ListItemText>{item.title}</ListItemText>
    </ListItemButton>
}

const CollapsedButton = ({ item, setPage }: MenuButtonProps) => {

    const [open, setOpen] = useState(false)

    const HiddenList = () => {
        if (!item.collapsedList) return
        return <List>
            {item.collapsedList.map(item => <NestedButton item={item} setPage={setPage} />)}
        </List>
    }

    return <>
        <ListItemButton
            key={item.key}
            className="text-white py-4 hover:bg-gray-600"
            onClick={() => setOpen(!open)}
        >
            <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
            <KeyboardArrowRight
                className={`transition-transform ease-in-out duration-300 ${open ? 'rotate-90' : 'rotate-0'}`}
            />
        </ListItemButton>
        <Collapse in={open} unmountOnExit>
            <HiddenList />
        </Collapse>
    </>
}

export const MenuButton = ({ item, setPage }: MenuButtonProps) => {
    if (item.collapsedList) {
        return <CollapsedButton item={item} setPage={setPage} />
    }
    return <NormalButton item={item} setPage={setPage} />
}
