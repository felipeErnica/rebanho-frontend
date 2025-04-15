import { JSX, useState } from "react";
import { TableAnimal } from "./TableAnimal";
import { InputBox } from "../components/text-components/InputBox";
import { Filter } from "../components/filter/Filter";

export const AnimalDisplay = (): JSX.Element => {
    const [filter, setFilter] = useState(false)
    const [name, setName] = useState("")

    const AnimalFilter = (): JSX.Element => {
        return <div className="flex-none">
            <InputBox
                type="search"
                placeholder="Pesquisar nome..."
                onInput={(event) => {
                    setFilter(true)
                    setName(event.currentTarget.value)
                }} />
        </div>
    }

    return (
        <div className="h-screen flex flex-col">
            <Filter panel={AnimalFilter}/>
            <div className="flex-grow max-h-[90vh] overflow-auto">
                <TableAnimal isFiltered={filter} name={name} />
            </div>
        </div>
    )
}
