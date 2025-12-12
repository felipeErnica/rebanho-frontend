import { TableFarmTopBar } from "./TableFarmTopBar"
import { TableInfoFarms } from "./TableInfoFarms"

export const FarmTableArea = () => {
    return <div className="h-full w-full flex flex-col">
        <TableFarmTopBar />
        <TableInfoFarms />
    </div>
}
