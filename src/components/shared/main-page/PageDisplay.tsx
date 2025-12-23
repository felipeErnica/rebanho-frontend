import { JSX, ReactNode, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { MainMenu } from "./main-menu/MainMenu";
import { TitleBar } from "./TitleBar";
import { PageContext } from "./PageContext";
import Toolbar from "@mui/material/Toolbar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import NavigateNext from "@mui/icons-material/NavigateNext";
import { HomePage } from "@features/home/HomePage";
import { Divider, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export type PageProps = {
    title: string
    crumbIcon?: ReactNode | ReactNode[]
    page: ReactNode | ReactNode[]
    previousPages?: PageProps[]
}

type BreadCrumbsToolbarProps = {
    pageProps: PageProps
    setPageProps: (page?: PageProps) => void
}

const BreadCrumbsToolbar = ({ pageProps: { previousPages, title, crumbIcon }, setPageProps }: BreadCrumbsToolbarProps) => {

    return <Toolbar className="border border-gray-200">
        <IconButton>
            <MenuIcon />
        </IconButton>
        <Divider />
        <Breadcrumbs separator={<NavigateNext />}>
            {previousPages?.map(previousPage => (
                <Button
                    variant="text"
                    className="text-gray-500 hover:text-gray-700 hover:bg-transparent hover:font-bold hover:underline"
                    startIcon={previousPage.crumbIcon}
                    onClick={() => setPageProps(previousPage)}
                >
                    {previousPage.title}
                </Button>
            ))}
            <Button
                disabled
                variant="text"
                className="text-gray-700 font-bold"
                startIcon={crumbIcon}
            >
                {title}
            </Button>
        </Breadcrumbs>
    </Toolbar>
}

export const PageDisplay = (): JSX.Element => {

    const [open, setOpen] = useState(true)
    const [pageProps, setPageProps] = useState<PageProps | undefined>(HomePage)

    return <Box className="w-screen h-screen flex flex-col">
        <TitleBar setOpen={setOpen} />
        <Drawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
        >
            <MainMenu setPage={setPageProps} setOpen={setOpen} />
        </Drawer>
        {pageProps && <BreadCrumbsToolbar {...{ pageProps, setPageProps }} />}
        <div className="w-full h-full overflow-auto">
            <PageContext.Provider value={{ pageProps, setPageProps }}>
                {pageProps?.page}
            </PageContext.Provider>
        </div>
    </Box>
}
