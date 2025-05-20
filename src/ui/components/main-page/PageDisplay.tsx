import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { JSX, useCallback, useState } from "react";
import Drawer from "@mui/material/Drawer";
import { AnimalDisplay } from "@/ui/features/animals/AnimalDisplay";
import Box from "@mui/material/Box";
import { MainMenu } from "./main-menu/MainMenu";

export const PageDisplay = (): JSX.Element => {

    const [open, setOpen] = useState(false)
    const [page, setPage] = useState<string>('')
    
    const MainPage = useCallback(() => {
        let currentPage = null
        switch (page) {
            case 'animals-table': 
                currentPage = <AnimalDisplay />
                break
        }
        return currentPage
    }, [page])


    return <Box className="w-screen h-screen flex flex-col">
        <AppBar className="bg-gray-700" position="static">
            <Toolbar>
                <IconButton className="hover:bg-gray-600 text-white" onClick={() => setOpen(true)}>
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
        <Drawer 
            anchor="left" 
            open={open} 
            onClose={() => setOpen(false)}
        >
            <MainMenu setPage={setPage} setOpen={setOpen} />
        </Drawer>
        <div className="grow overflow-hidden">
            {MainPage()}
        </div>
    </Box>
}
