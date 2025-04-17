import { IFilters } from "../interfaces/Filter";

export function activateFilter<F extends IFilters>(filter: F): F {
    if (!filter.isFiltered) {
        return {...filter, isFiltered: true}
    }
    return {...filter}
}
