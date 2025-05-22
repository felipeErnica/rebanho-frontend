import { JSX, useCallback, useState } from "react";
import Drawer from "@mui/material/Drawer";
import { AnimalDisplay } from "@/ui/features/animals/AnimalDisplay";
import Box from "@mui/material/Box";
import { MainMenu } from "./main-menu/MainMenu";
import { TitleBar } from "./TitleBar";
import { BirthDisplay } from "@/ui/features/reproduction/births/BirthDisplay";
import { InseminationDisplay } from "@/ui/features/reproduction/insemination/InseminationDisplay";
import { NaturalMatingDisplay } from "@/ui/features/reproduction/natural-reproduction/NaturalMatingDisplay";
import { EmbryoTransferDisplay } from "@/ui/features/reproduction/embryo-transfer/EmbryoTransferDisplay";
import { BirthTestDisplay } from "@/ui/features/reproduction/birth-test/BirthTestDisplay";
import { LossDisplay } from "@/ui/features/reproduction/pregnancy-loss/LossDisplay";

export const PageDisplay = (): JSX.Element => {

    const [open, setOpen] = useState(false)
    const [page, setPage] = useState<string>('')

    const MainPage = useCallback(() => {
        let currentPage = null
        switch (page) {
            case 'animals-table':
                currentPage = <AnimalDisplay />
                break
            case 'births':
                currentPage = <BirthDisplay />
                break
            case 'insemination':
                currentPage = <InseminationDisplay />
                break
            case 'mating':
                currentPage = <NaturalMatingDisplay />
                break
            case 'embryo-transfer':
                currentPage = <EmbryoTransferDisplay />
                break
            case 'birth-test':
                currentPage = <BirthTestDisplay />
                break
            case 'pregnancy-loss':
                currentPage = <LossDisplay />
                break
        }
        return currentPage
    }, [page])


    return <Box className="w-screen h-screen flex flex-col">
        <TitleBar setOpen={setOpen} />
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
