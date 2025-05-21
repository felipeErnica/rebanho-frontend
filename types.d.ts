type electronEvents = {
    closeLogin: () => void
    openMain: () => void
    closeMain: () => void
    maximizeMain: () => void
    minimizeMain: () => void
    getAuthToken: () => Promise<any>
    setAuthToken: (token: string) => void
}

interface Window {
    electronEvents: electronEvents
}
