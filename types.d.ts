export type electronEvents = {
    closeLogin: () => void
    openMain: () => void
    closeMain: () => void
    maximizeMain: () => void
    minimizeMain: () => void
    getAuthToken: () => Promise<any>
    setAuthToken: (token: string) => void
}

export interface Window {
    electronEvents: electronEvents
}
