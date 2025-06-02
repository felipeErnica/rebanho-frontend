import { JSX, ReactNode, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { MainMenu } from "./main-menu/MainMenu";
import { TitleBar } from "./TitleBar";

export const PageDisplay = (): JSX.Element => {

    const [open, setOpen] = useState(false)
    const [page, setPage] = useState<ReactNode | ReactNode[]>(null)

    return <Box className="w-screen h-screen flex flex-col">
        <TitleBar setOpen={setOpen} />
        <Drawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
        >
            <MainMenu setPage={setPage} setOpen={setOpen} />
        </Drawer>
        <div className="p-2 grow overflow-hidden bg-gray-100">
            {page}
        </div>
    </Box>
}
