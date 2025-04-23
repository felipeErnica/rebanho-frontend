import { JSX, useCallback, useState } from "react";
import { ComboBox, ComboBoxItem } from "@/ui/components/common/ComboBox";
import { AbstractFilterDiv, DateFilterDiv, NumberFilterDiv } from "@/ui/components/common/CommonFilterDivs";
import { InputBox } from "@/ui/components/common/InputBox";
import { activateFilter } from "@/util/Filter";
import { AnimalFilter } from "@/types/Animal";
import { TableTopBar } from "@/ui/components/table/TableTopBar";
import { TableAnimal } from "./TableAnimal";
import { FilterDrawer } from "@/ui/components/common/Drawer";

export const AnimalDisplay = (): JSX.Element => {

    const [filter, setFilter] = useState<AnimalFilter>({isFiltered: false})
    const [isDrawerOpen, setOpenDrawer] = useState(false)
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState('name')

    const sortableColumns: ComboBoxItem[] = [
        {name: "Nome", value: "name"},
        {name: "Data de Morte", value: "death_date"},
        {name: "Brinco", value: "ring_order"},
    ]

    const AnimalFilter = (): JSX.Element => {
        return <div className="grid grid-cols-1 grid-rows-[auto] gap-16">

            <AbstractFilterDiv mainTitle="Informações principais">
                <div className="grid grid-cols-1 grid-rows-3 gap-2">
                    <InputBox
                        type="search"
                        placeholder="Pesquisar brinco..."
                    />
                    <InputBox
                        onInput={(event) => {
                            const newFilter = activateFilter(filter)
                            newFilter.name = event.currentTarget.value
                            setFilter(newFilter)
                        }}
                        type="search"
                        placeholder="Pesquisar nome..."
                    />
                    <ComboBox placeholder="Selecionar sexo..." items={[{name: "M"}, {name: "F"}]} />
                </div>
            </AbstractFilterDiv>

            <DateFilterDiv mainTitle="Data de Nascimento" />
            <DateFilterDiv mainTitle="Data de Morte" />
            <NumberFilterDiv mainTitle="Valor de Pico" step=".1" />
            <NumberFilterDiv mainTitle="Intervalo entre Partos Médio" step=".1" />
            <NumberFilterDiv mainTitle="I.S.R. Médio" step=".1" />
            <NumberFilterDiv mainTitle="Produção Média" step=".1" />
            <NumberFilterDiv mainTitle="Quantidade de Filho" />
        </div>
    }

    const onOrderChange = useCallback(() => setOrder(order === 'asc' ? 'desc' : 'asc'), [order])
    const onSortChange = useCallback((newSort: string) => setSort(newSort), [])
    const onClose = useCallback(() => { setOpenDrawer(false) }, [])
    const onOpenDrawer = useCallback(() => {
        if (!isDrawerOpen) {
            setOpenDrawer(true)
        }
    }, [isDrawerOpen])

    return (
        <div className="h-screen w-screen grid grid-cols-[1fr_auto]">
            <div className="h-full grid grid-rows-[auto_1fr] overflow-x-auto">
                <TableTopBar 
                    title="Tabela de Rebanho" 
                    sortableColumns={sortableColumns}
                    order={order}
                    sort={sort}
                    onOrderChange={onOrderChange}
                    onSortChange={onSortChange}
                    onOpenFilter={onOpenDrawer} 
                />
                <TableAnimal sort={sort} order={order} filter={filter} />
            </div>
            <FilterDrawer childPanel={AnimalFilter} isOpen={isDrawerOpen} onClose={onClose} />
        </div>
    )

}
