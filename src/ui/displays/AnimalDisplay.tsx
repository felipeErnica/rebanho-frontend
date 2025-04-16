import { JSX, useState } from "react";
import { TableAnimal } from "./TableAnimal";
import { TableTopBar } from "../components/table/TableTopBar";
import { Drawer } from "../components/common/Drawer";

export const AnimalDisplay = (): JSX.Element => {

    const [openDrawer, setOpenDrawer] = useState(false)

    //const AnimalFilter = (): JSX.Element => {
    //return <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto] gap-2">
    //<InputBox
    //type="search"
    //placeholder="Pesquisar brinco..."
    ///>
    //<InputBox
    //type="search"
    //placeholder="Pesquisar nome..."
    //onInput={(event) => {
    //setFilter(true)
    //setName(event.currentTarget.value)
    //}} />
    //<ComboBox placeholder="Selecionar sexo..." items={["M", "F"]} />
    //<div className="col-start-2 grid grid-cols-3 gap-2">
    //<div className="grid grid-rows-2 grid-cols-[auto_1fr] gap-2">
    //<label>Valor de Pico Mínimo:</label>
    //<InputBox type="number" />
    //<label>Valor de Pico Máximo:</label>
    //<InputBox type="number" />
    //</div>
    //<div className="grid grid-rows-2 grid-cols-[auto_1fr] gap-2">
    //<label>Valor de Pico Mínimo:</label>
    //<InputBox type="number" />
    //<label>Valor de Pico Máximo:</label>
    //<InputBox type="number" />
    //</div>
    //<div className="grid grid-rows-2 grid-cols-[auto_1fr] gap-2">
    //<label>Valor de Pico Mínimo:</label>
    //<InputBox type="number" />
    //<label>Valor de Pico Máximo:</label>
    //<InputBox type="number" />
    //</div>
    //</div>
    //</div>
    //}

    const buttonDrawer = (isOpen: boolean) => {
        setOpenDrawer(isOpen)
    }

    return (
        <div className="h-screen w-screen grid grid-cols-[1fr_auto]"> 
            <div className="h-full grid grid-rows-[auto_1fr] overflow-x-auto">
                <TableTopBar openFilter={buttonDrawer} isFilterOpen={openDrawer} title="Tabela de Rebanho" />
                <div className="overflow-auto">
                    <TableAnimal isFiltered={false} />
                </div>
            </div>
            <Drawer isOpen={openDrawer} openEvent={buttonDrawer} /> 
        </div>
    )

}
