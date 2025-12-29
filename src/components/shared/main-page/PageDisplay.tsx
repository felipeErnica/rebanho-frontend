import { Dispatch, JSX, SetStateAction, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { MainMenu } from "./MainMenu";
import { TitleBar } from "./TitleBar";
import Toolbar from "@mui/material/Toolbar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import NavigateNext from "@mui/icons-material/NavigateNext";
import { Divider, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet, UIMatch, useMatches  } from "react-router";
import { RouteHandle } from "@/Routes";

type BreadCrumbsToolbarProps = {
    setOpen: Dispatch<SetStateAction<boolean>>
}

const BreadCrumbsToolbar = ({ setOpen }: BreadCrumbsToolbarProps) => {

    const matches = useMatches() as UIMatch<unknown, RouteHandle>[]

    return <Toolbar className="border border-gray-200 flex flex-row gap-4">
        <IconButton onClick={() => setOpen(v => !v)}>
            <MenuIcon />
        </IconButton>

        <Divider orientation="vertical" />

        <Breadcrumbs separator={<NavigateNext />}>
            {matches
                .filter(match => match.handle?.title)
                .map((match, index, arr) => {
                    const title =
                        typeof match.handle.title === 'function'
                            ? match.handle.title(match.params, match?.loaderData)
                            : match.handle.title

                    return (
                        <Button
                            key={match.pathname}
                            component={Link}
                            to={match.pathname}
                            variant="text"
                            disabled={index === arr.length - 1}
                            startIcon={match.handle.icon}
                        >
                            {title}
                        </Button>
                    )
                })}
        </Breadcrumbs>
    </Toolbar>

}

export const PageDisplay = (): JSX.Element => {

    const [open, setOpen] = useState(false)

    return <Box className="w-screen h-screen flex flex-col">
        <TitleBar />
        <Drawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
        >
            <MainMenu setOpen={setOpen} />
        </Drawer>
        <BreadCrumbsToolbar {...{ setOpen }} />
        <div className="w-full h-full overflow-auto">
            <Outlet />
        </div>
    </Box>
}
