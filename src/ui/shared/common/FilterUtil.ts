import { IFilters } from "@/shared/interfaces/Filter";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";

export type FilterValueProps = {
    setFilterValue: (field: string, value: any) => void
}

export function useFilterForm<T extends IFilters>(): UseFormReturn<T> {
    return useForm({
        defaultValues: {isFiltered: false} as DefaultValues<T>,
        mode: 'onChange'
    })
}
