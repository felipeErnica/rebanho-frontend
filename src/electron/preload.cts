import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronEvents',{
    closeLogin: () => ipcRenderer.send('close-login')
})
