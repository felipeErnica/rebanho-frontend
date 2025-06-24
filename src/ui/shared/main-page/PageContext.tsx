import { createContext } from "react"
import { PageProps } from "./PageDisplay"

interface PageContextProps {
    pageProps?: PageProps
    setPageProps?: (page: PageProps) => void
}

export const PageContext = createContext<PageContextProps>({})
