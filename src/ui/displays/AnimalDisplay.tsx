import { JSX, useState } from "react";
import { TableAnimal } from "./TableAnimal";
import { InputBox } from "../components/text-components/InputBox";

export const AnimalDisplay = ():JSX.Element => {
    const [filter, setFilter] = useState(false)
    const [name, setName] = useState("")

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-none px-4 py-2">
                <InputBox 
                    type="search" 
                    placeholder="Pesquisar nome..." 
                    onInput={(event) => {
                        setFilter(true)
                        setName(event.currentTarget.value)
                    }} />
            </div>
            <div className="flex-grow max-h-[90vh] overflow-auto">
                <TableAnimal isFiltered={filter} name={name}/>
            </div>
        </div>
    )
}
