import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const electronEvents = {
    closeLogin: () => ipcRenderer.send('close-login'),
    openMain: () => ipcRenderer.send('open-main'),
    closeMain: () => ipcRenderer.send('close-main'),
    maximizeMain: () => ipcRenderer.send('maximize-main'),
    minimizeMain: () => ipcRenderer.send('minimize-main'),
    getAuthToken: () => ipcRenderer.invoke('get-token'),
    setAuthToken: (token: string) => ipcRenderer.send('set-token', token),
}

contextBridge.exposeInMainWorld('electronEvents', electronEvents)
