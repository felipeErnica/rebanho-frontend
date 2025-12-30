import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { useState } from "react"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import List from "@mui/material/List"
import { Collapse } from "@mui/material";
import { useNavigate } from "react-router";
import { MenuItem } from "./MainMenu";

type MenuButtonProps = { item: MenuItem }

const NormalButton = ({ item }: MenuButtonProps) => {

    const navigate = useNavigate()

    return <ListItemButton
        key={item.key}
        className="text-white py-4 hover:bg-gray-600"
        onClick={() => navigate(item.path)}
    >
        <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
        <ListItemText>{item.title}</ListItemText>
    </ListItemButton>
}

const NestedButton = ({ item }: MenuButtonProps) => {

    const navigate = useNavigate()

    return <ListItemButton
        key={item.key}
        className="text-white pl-10 py-4 hover:bg-gray-600"
            onClick={() => navigate(item.path)}
    >
        <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
        <ListItemText>{item.title}</ListItemText>
    </ListItemButton>
}

const CollapsedButton = ({ item }: MenuButtonProps) => {

    const [open, setOpen] = useState(false)

    const HiddenList = () => {
        if (!item.children) return
        return <List>
            {item.children.map(child => <NestedButton item={{ ...child, path: item.path + "/" + child.path }} />)}
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

export const MenuButton = ({ item }: MenuButtonProps) => {
    if (item.children) {
        return <CollapsedButton item={item} />
    }
    return <NormalButton item={item} />
}
